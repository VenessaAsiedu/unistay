"use client";

/**
 * TEMPORARY debug route: /debug-filepond
 *
 * Reproduces the newproperty form's file field outside the auth gate so the
 * "[object Object]" unhandled rejection can be observed without signing in.
 * Delete this file once the cause is confirmed.
 */

import React from "react";
import { useForm } from "react-hook-form";
import { CustomFormField } from "@/components/FormField";
import { Form } from "@/components/ui/form";

const DebugFilePond = () => {
  const form = useForm({
    defaultValues: { photoUrls: [], name: "" },
  });

  return (
    <div style={{ padding: 32, maxWidth: 720 }}>
      <h1 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>
        FilePond isolation test
      </h1>
      <p style={{ marginBottom: 24, color: "#666" }}>
        If an unhandled rejection appears in the console on load, FilePond is
        the source.
      </p>
      <Form {...form}>
        <form className="space-y-6">
          <CustomFormField name="name" label="Plain text field" />
          <CustomFormField
            name="photoUrls"
            label="Property Photos"
            type="file"
            accept="image/*"
          />
        </form>
      </Form>
    </div>
  );
};

export default DebugFilePond;
