import { Request, Response } from "express";
import { PrismaClient, Prisma } from "@prisma/client";
import { wktToGeoJSON } from "@terraformer/wkt";
import { S3Client } from "@aws-sdk/client-s3";
import { Location } from "@prisma/client";
import { Upload } from "@aws-sdk/lib-storage";
import axios from "axios";
import fs from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

export const UPLOADS_DIR = path.join(__dirname, "..", "..", "uploads");

const s3Client = new S3Client({
  // fallback keeps the server bootable when AWS isn't configured yet;
  // photo uploads still require real AWS credentials in .env
  region: process.env.AWS_REGION || "us-east-1",
});

export const getProperties = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      favoriteIds,
      priceMin,
      priceMax,
      beds,
      baths,
      propertyType,
      squareFeetMin,
      squareFeetMax,
      amenities,
      availableFrom,
      latitude,
      longitude,
    } = req.query;

    let whereConditions: Prisma.Sql[] = [];

    if (favoriteIds) {
      const favoriteIdsArray = (favoriteIds as string).split(",").map(Number);
      whereConditions.push(
        Prisma.sql`p.id IN (${Prisma.join(favoriteIdsArray)})`
      );
    }

    if (priceMin) {
      whereConditions.push(
        Prisma.sql`p."pricePerMonth" >= ${Number(priceMin)}`
      );
    }

    if (priceMax) {
      whereConditions.push(
        Prisma.sql`p."pricePerMonth" <= ${Number(priceMax)}`
      );
    }

    if (beds && beds !== "any") {
      whereConditions.push(Prisma.sql`p.beds >= ${Number(beds)}`);
    }

    if (baths && baths !== "any") {
      whereConditions.push(Prisma.sql`p.baths >= ${Number(baths)}`);
    }

    if (squareFeetMin) {
      whereConditions.push(
        Prisma.sql`p."squareFeet" >= ${Number(squareFeetMin)}`
      );
    }

    if (squareFeetMax) {
      whereConditions.push(
        Prisma.sql`p."squareFeet" <= ${Number(squareFeetMax)}`
      );
    }

    if (propertyType && propertyType !== "any") {
      whereConditions.push(
        Prisma.sql`p."propertyType" = ${propertyType}::"PropertyType"`
      );
    }

    if (amenities && amenities !== "any") {
      const amenitiesArray = (amenities as string).split(",");
      whereConditions.push(Prisma.sql`p.amenities @> ${amenitiesArray}`);
    }

    if (availableFrom && availableFrom !== "any") {
      const availableFromDate =
        typeof availableFrom === "string" ? availableFrom : null;
      if (availableFromDate) {
        const date = new Date(availableFromDate);
        if (!isNaN(date.getTime())) {
          whereConditions.push(
            Prisma.sql`EXISTS (
              SELECT 1 FROM "Lease" l 
              WHERE l."propertyId" = p.id 
              AND l."startDate" <= ${date.toISOString()}
            )`
          );
        }
      }
    }

    if (latitude && longitude) {
      const lat = parseFloat(latitude as string);
      const lng = parseFloat(longitude as string);
      const radiusInKilometers = 1000;
      const degrees = radiusInKilometers / 111; // Converts kilometers to degrees

      whereConditions.push(
        Prisma.sql`ST_DWithin(
          l.coordinates::geometry,
          ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326),
          ${degrees}
        )`
      );
    }

    const completeQuery = Prisma.sql`
      SELECT 
        p.*,
        json_build_object(
          'id', l.id,
          'address', l.address,
          'city', l.city,
          'state', l.state,
          'country', l.country,
          'postalCode', l."postalCode",
          'coordinates', json_build_object(
            'longitude', ST_X(l."coordinates"::geometry),
            'latitude', ST_Y(l."coordinates"::geometry)
          )
        ) as location
      FROM "Property" p
      JOIN "Location" l ON p."locationId" = l.id
      ${
        whereConditions.length > 0
          ? Prisma.sql`WHERE ${Prisma.join(whereConditions, " AND ")}`
          : Prisma.empty
      }
    `;

    const properties = await prisma.$queryRaw(completeQuery);

    res.json(properties);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving properties: ${error.message}` });
  }
};

export const getProperty = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const property = await prisma.property.findUnique({
      where: { id: Number(id) },
      include: {
        location: true,
      },
    });

    if (property) {
      const coordinates: { coordinates: string }[] =
        await prisma.$queryRaw`SELECT ST_asText(coordinates) as coordinates from "Location" where id = ${property.location.id}`;

      const geoJSON: any = wktToGeoJSON(coordinates[0]?.coordinates || "");
      const longitude = geoJSON.coordinates[0];
      const latitude = geoJSON.coordinates[1];

      const propertyWithCoordinates = {
        ...property,
        location: {
          ...property.location,
          coordinates: {
            longitude,
            latitude,
          },
        },
      };
      res.json(propertyWithCoordinates);
    } else {
      res.status(404).json({ message: "Property not found" });
    }
  } catch (err: any) {
    res
      .status(500)
      .json({ message: `Error retrieving property: ${err.message}` });
  }
};

export const getPropertyLeases = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const leases = await prisma.lease.findMany({
      where: { propertyId: Number(id) },
      include: {
        tenant: true,
        payments: true,
      },
    });
    res.json(leases);
  } catch (err: any) {
    res
      .status(500)
      .json({ message: `Error retrieving property leases: ${err.message}` });
  }
};

// Tries the full address first, then progressively broader searches, so a
// house name or unknown street still lands the property in the right area
// instead of at 0,0 (which hides it from every location search).
const geocodeAddress = async (loc: {
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}): Promise<{ longitude: number; latitude: number } | null> => {
  const queries: Record<string, string>[] = [
    {
      street: loc.address,
      city: loc.city,
      country: loc.country,
      postalcode: loc.postalCode,
    },
    { street: loc.address, city: loc.city, country: loc.country },
    { q: [loc.city, loc.state, loc.country].filter(Boolean).join(", ") },
    { q: [loc.city, loc.country].filter(Boolean).join(", ") },
    { q: [loc.state, loc.country].filter(Boolean).join(", ") },
  ];

  for (const query of queries) {
    try {
      const { data } = await axios.get(
        `https://nominatim.openstreetmap.org/search?${new URLSearchParams({
          ...query,
          format: "json",
          limit: "1",
        }).toString()}`,
        { headers: { "User-Agent": "UniStay (property geocoding)" } }
      );
      if (data[0]?.lon && data[0]?.lat) {
        return {
          longitude: parseFloat(data[0].lon),
          latitude: parseFloat(data[0].lat),
        };
      }
    } catch (err) {
      console.error("Geocoding request failed:", err);
    }
  }
  return null;
};

export const createProperty = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const files = req.files as Express.Multer.File[];
    const {
      address,
      city,
      state,
      country,
      postalCode,
      managerCognitoId,
      ...propertyData
    } = req.body;

    const coords = await geocodeAddress({
      address,
      city,
      state,
      country,
      postalCode,
    });
    if (!coords) {
      res.status(400).json({
        message:
          "Could not find this location on the map. Check the city, state and country spelling.",
      });
      return;
    }
    const { longitude, latitude } = coords;

    // Photos go to S3 when AWS_BUCKET_NAME is set; otherwise (local dev) they
    // are written to server/uploads and served by Express at /uploads.
    const bucket = process.env.AWS_BUCKET_NAME;
    const photoUrls = await Promise.all(
      (files ?? []).map(async (file) => {
        const key = `${Date.now()}-${file.originalname.replace(/[^\w.-]/g, "_")}`;

        if (!bucket) {
          await fs.mkdir(UPLOADS_DIR, { recursive: true });
          await fs.writeFile(path.join(UPLOADS_DIR, key), file.buffer);
          return `/uploads/${key}`;
        }

        const uploadResult = await new Upload({
          client: s3Client,
          params: {
            Bucket: bucket,
            Key: `properties/${key}`,
            Body: file.buffer,
            ContentType: file.mimetype,
          },
        }).done();

        return uploadResult.Location;
      })
    );

    // create location
    const [location] = await prisma.$queryRaw<Location[]>`
      INSERT INTO "Location" (address, city, state, country, "postalCode", coordinates)
      VALUES (${address}, ${city}, ${state}, ${country}, ${postalCode}, ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326))
      RETURNING id, address, city, state, country, "postalCode", ST_AsText(coordinates) as coordinates;
    `;

    // create property
    const newProperty = await prisma.property.create({
      data: {
        ...propertyData,
        photoUrls,
        locationId: location.id,
        managerCognitoId,
        amenities:
          typeof propertyData.amenities === "string"
            ? propertyData.amenities.split(",")
            : [],
        highlights:
          typeof propertyData.highlights === "string"
            ? propertyData.highlights.split(",")
            : [],
        pricePerMonth: parseFloat(propertyData.pricePerMonth),
        securityDeposit: parseFloat(propertyData.securityDeposit),
        applicationFee: parseFloat(propertyData.applicationFee),
        beds: parseInt(propertyData.beds),
        baths: parseFloat(propertyData.baths),
        squareFeet: parseInt(propertyData.squareFeet),
      },
      include: {
        location: true,
        manager: true,
      },
    });

    res.status(201).json(newProperty);
  } catch (err: any) {
    res
      .status(500)
      .json({ message: `Error creating property: ${err.message}` });
  }
};
