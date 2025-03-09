import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { profileSchema, projectSchema, friendSchema } from "@shared/schema";

type ContentType = "profile" | "projects" | "friends";

// Define schemas for form validation
const profileFormSchema = profileSchema.omit({ id: true });
const projectFormSchema = z.array(projectSchema.omit({ id: true }));
const friendFormSchema = z.array(friendSchema.omit({ id: true }));

interface ContentEditorProps {
  contentType: ContentType;
  initialData: any;
  onSaveSuccess: () => void;
}

export default function ContentEditor({ contentType, initialData, onSaveSuccess }: ContentEditorProps) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  // Choose the schema based on content type
  let schema;
  switch (contentType) {
    case "profile":
      schema = profileFormSchema;
      break;
    case "projects":
      schema = projectFormSchema;
      break;
    case "friends":
      schema = friendFormSchema;
      break;
  }

  // Set up the form
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: initialData || {},
  });

  // Mutation to save data
  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", `/api/admin/${contentType}`, data);
    },
    onSuccess: () => {
      onSaveSuccess();
      setIsEditing(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: `Failed to save ${contentType} data.`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: any) => {
    saveMutation.mutate(data);
  };

  // For profile editing - render profile form fields
  const renderProfileForm = () => {
    if (!initialData) return <div>Loading...</div>;

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title/Position</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="avatar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avatar URL</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tagline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tagline</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="workspaceImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Workspace Image URL</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="mt-6">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short Description</FormLabel>
                  <FormControl>
                    <Textarea rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="mt-6">
            <FormField
              control={form.control}
              name="aboutText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>About Text</FormLabel>
                  <FormControl>
                    <Textarea rows={5} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="mt-6">
            <FormField
              control={form.control}
              name="approachText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Approach Text</FormLabel>
                  <FormControl>
                    <Textarea rows={5} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="mt-6" disabled={saveMutation.isPending}>
            {saveMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </Form>
    );
  };

  // For viewing content as JSON
  const renderJsonViewer = () => {
    return (
      <div>
        <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-auto max-h-96">
          {JSON.stringify(initialData, null, 2)}
        </pre>
        <Button onClick={() => setIsEditing(true)} className="mt-4">
          Edit Content
        </Button>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {contentType === "profile"
            ? "Edit Profile Information"
            : contentType === "projects"
            ? "Manage Projects"
            : "Manage Network"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          contentType === "profile" ? (
            renderProfileForm()
          ) : (
            <div>
              <Textarea
                className="font-mono text-sm h-96"
                value={JSON.stringify(initialData, null, 2)}
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    form.reset(parsed);
                  } catch (error) {
                    // Allow incomplete JSON during editing
                  }
                }}
              />
              <div className="mt-4 flex space-x-4">
                <Button
                  onClick={form.handleSubmit(onSubmit)}
                  disabled={saveMutation.isPending}
                >
                  {saveMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )
        ) : (
          renderJsonViewer()
        )}
      </CardContent>
    </Card>
  );
}
