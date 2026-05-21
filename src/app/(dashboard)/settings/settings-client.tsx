"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { UploadButton } from "@/lib/uploadthing";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import { Camera, User, Mail, Lock, Shield, HardDrive } from "lucide-react";

interface SettingsClientProps {
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    role: string;
    password: string | null;
    storageUsed: number;
    storageLimit: number;
    createdAt: Date;
  };
}

const nameSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
});

const emailSchema = z.object({
  newEmail: z.string().email("Please enter a valid email address"),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type NameInput = z.infer<typeof nameSchema>;
type EmailInput = z.infer<typeof emailSchema>;
type PasswordInput = z.infer<typeof passwordSchema>;

function formatBytes(bytes: number): string {
  const mb = bytes / (1024 * 1024);
  if (mb < 1024) return `${mb.toFixed(1)} MB`;
  return `${(mb / 1024).toFixed(1)} GB`;
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const roleLabel: Record<string, string> = {
  USER: "User",
  ADMIN: "Admin",
  SUPERADMIN: "Super Admin",
};

export default function SettingsClient({ user }: SettingsClientProps) {
  const searchParams = useSearchParams();
  const [avatar, setAvatar] = useState(user.image);
  const [isUpdatingName, setIsUpdatingName] = useState(false);
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const storagePercentage = Math.round(
    (user.storageUsed / user.storageLimit) * 100,
  );

  // Show success/error from email verification redirect
  const urlSuccess = searchParams.get("success");
  const urlError = searchParams.get("error");

  const nameForm = useForm<NameInput>({
    resolver: zodResolver(nameSchema),
    defaultValues: { name: user.name ?? "" },
  });

  const emailForm = useForm<EmailInput>({
    resolver: zodResolver(emailSchema),
    defaultValues: { newEmail: "" },
  });

  const passwordForm = useForm<PasswordInput>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function handleNameUpdate(data: NameInput) {
    setIsUpdatingName(true);
    try {
      const response = await fetch("/api/settings/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) {
        toast.error(result.error);
        return;
      }
      toast.success("Name updated successfully.");
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setIsUpdatingName(false);
    }
  }

  async function handleEmailUpdate(data: EmailInput) {
    setIsUpdatingEmail(true);
    try {
      const response = await fetch("/api/settings/email", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) {
        toast.error(result.error);
        return;
      }
      toast.success(result.message);
      emailForm.reset();
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setIsUpdatingEmail(false);
    }
  }

  async function handlePasswordUpdate(data: PasswordInput) {
    setIsUpdatingPassword(true);
    try {
      const response = await fetch("/api/settings/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) {
        toast.error(result.error);
        return;
      }
      toast.success("Password updated successfully.");
      passwordForm.reset();
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setIsUpdatingPassword(false);
    }
  }

  const initials = (user.name ?? "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="space-y-8 mx-auto max-w-2xl">
      {/* Header */}
      <div>
        <h2 className="font-bold text-slate-900 text-2xl">Settings</h2>
        <p className="mt-1 text-slate-500">
          Manage your account settings and preferences
        </p>
      </div>

      {/* URL Success/Error Messages */}
      {urlSuccess === "email-updated" && (
        <div className="bg-green-50 p-3 rounded-md text-green-600 text-sm">
          Email address updated successfully.
        </div>
      )}
      {urlError && (
        <div className="bg-red-50 p-3 rounded-md text-red-600 text-sm">
          {urlError === "invalid-token" &&
            "Invalid or expired verification link."}
          {urlError === "expired-token" &&
            "Verification link has expired. Please request a new one."}
          {urlError === "something-went-wrong" &&
            "Something went wrong. Please try again."}
        </div>
      )}

      {/* Profile Picture */}
      <div className="space-y-4 bg-white p-6 border rounded-xl">
        <div className="flex items-center gap-2 mb-4">
          <Camera className="w-5 h-5 text-slate-600" />
          <h3 className="font-semibold text-slate-900">Profile Picture</h3>
        </div>
        <div className="flex items-center gap-6">
          <Avatar className="w-20 h-20">
            {avatar ? (
              <div className="relative rounded-full w-20 h-20 overflow-hidden">
                <Image
                  src={avatar}
                  alt="Profile picture"
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <AvatarFallback className="bg-slate-100 text-slate-700 text-2xl">
                {initials}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="space-y-2">
            <UploadButton
              endpoint="avatarUploader"
              appearance={{
                button:
                  "bg-slate-900 text-white text-sm px-4 py-2 rounded-lg hover:bg-slate-700",
                allowedContent: "hidden",
              }}
              onClientUploadComplete={(res) => {
                if (res?.[0]) {
                  setAvatar(res[0].url);
                  toast.success("Profile picture updated.");
                  // Refresh page to update session and navbars
                  window.location.reload();
                }
              }}
              onUploadError={() => {
                toast.error("Failed to upload picture.");
              }}
            />
            <p className="text-slate-400 text-xs">JPG or PNG. Max 4MB.</p>
          </div>
        </div>
      </div>

      {/* Change Name */}
      <div className="space-y-4 bg-white p-6 border rounded-xl">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-5 h-5 text-slate-600" />
          <h3 className="font-semibold text-slate-900">Full Name</h3>
        </div>
        <form onSubmit={nameForm.handleSubmit(handleNameUpdate)}>
          <FieldGroup className="gap-4">
            <Field>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input
                id="name"
                placeholder="John Doe"
                {...nameForm.register("name")}
              />
              <FieldError errors={[nameForm.formState.errors.name]} />
            </Field>
            <Button type="submit" size="sm" disabled={isUpdatingName}>
              {isUpdatingName ? "Saving..." : "Save Name"}
            </Button>
          </FieldGroup>
        </form>
      </div>

      {/* Change Email */}
      <div className="space-y-4 bg-white p-6 border rounded-xl">
        <div className="flex items-center gap-2 mb-4">
          <Mail className="w-5 h-5 text-slate-600" />
          <h3 className="font-semibold text-slate-900">Email Address</h3>
        </div>
        <p className="text-slate-500 text-sm">
          Current email:{" "}
          <span className="font-medium text-slate-900">{user.email}</span>
        </p>
        <form onSubmit={emailForm.handleSubmit(handleEmailUpdate)}>
          <FieldGroup className="gap-4">
            <Field>
              <FieldLabel htmlFor="newEmail">New Email Address</FieldLabel>
              <Input
                id="newEmail"
                type="email"
                placeholder="newemail@example.com"
                {...emailForm.register("newEmail")}
              />
              <FieldError errors={[emailForm.formState.errors.newEmail]} />
            </Field>
            <Button type="submit" size="sm" disabled={isUpdatingEmail}>
              {isUpdatingEmail ? "Sending..." : "Send Verification Email"}
            </Button>
          </FieldGroup>
        </form>
        <p className="text-slate-400 text-xs">
          A verification email will be sent to your new email address.
        </p>
      </div>

      {/* Change Password — Credential users only */}
      {user.password && (
        <div className="space-y-4 bg-white p-6 border rounded-xl">
          <div className="flex items-center gap-2 mb-4">
            <Lock className="w-5 h-5 text-slate-600" />
            <h3 className="font-semibold text-slate-900">Change Password</h3>
          </div>
          <form onSubmit={passwordForm.handleSubmit(handlePasswordUpdate)}>
            <FieldGroup className="gap-4">
              <Field>
                <FieldLabel htmlFor="currentPassword">
                  Current Password
                </FieldLabel>
                <Input
                  id="currentPassword"
                  type="password"
                  placeholder="••••••••"
                  {...passwordForm.register("currentPassword")}
                />
                <FieldError
                  errors={[passwordForm.formState.errors.currentPassword]}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="newPassword">New Password</FieldLabel>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="••••••••"
                  {...passwordForm.register("newPassword")}
                />
                <FieldError
                  errors={[passwordForm.formState.errors.newPassword]}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="confirmPassword">
                  Confirm New Password
                </FieldLabel>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  {...passwordForm.register("confirmPassword")}
                />
                <FieldError
                  errors={[passwordForm.formState.errors.confirmPassword]}
                />
              </Field>
              <Button type="submit" size="sm" disabled={isUpdatingPassword}>
                {isUpdatingPassword ? "Updating..." : "Update Password"}
              </Button>
            </FieldGroup>
          </form>
        </div>
      )}

      <Separator />

      {/* Account Info — Read Only */}
      <div className="space-y-4 bg-white p-6 border rounded-xl">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-slate-600" />
          <h3 className="font-semibold text-slate-900">Account Information</h3>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-slate-500 text-sm">Role</span>
            <Badge variant="secondary">
              {roleLabel[user.role] ?? user.role}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500 text-sm">Member since</span>
            <span className="font-medium text-slate-900 text-sm">
              {formatDate(user.createdAt)}
            </span>
          </div>
        </div>
      </div>

      {/* Storage Info */}
      <div className="space-y-4 bg-white p-6 border rounded-xl">
        <div className="flex items-center gap-2 mb-4">
          <HardDrive className="w-5 h-5 text-slate-600" />
          <h3 className="font-semibold text-slate-900">Storage</h3>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-500">Used</span>
            <span className="font-medium text-slate-900">
              {formatBytes(user.storageUsed)} / {formatBytes(user.storageLimit)}
            </span>
          </div>
          <div className="bg-slate-100 rounded-full w-full h-2 overflow-hidden">
            <div
              className="bg-slate-900 rounded-full h-full transition-all"
              style={{ width: `${Math.min(storagePercentage, 100)}%` }}
            />
          </div>
          <p className="text-slate-400 text-xs">
            {storagePercentage}% of your storage used
          </p>
        </div>
      </div>
    </div>
  );
}
