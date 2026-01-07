"use client";

import * as React from "react"
import { cn } from "@/lib/utils"
import Button from "@/components/ui/button"
import Field, {
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import Input from "@/components/ui/input"
import { useLoginForm } from "./useLoginForm";

export default function LoginForm({
    className,
    ...props
}: React.ComponentProps<"form">) {
    const {
        email,
        setEmail,
        password,
        setPassword,
        error,
        loading,
        handleSubmit
    } = useLoginForm();

    return (
        <form className={cn("flex flex-col gap-6", className)} {...props} onSubmit={handleSubmit}>
            <FieldGroup>
                <div className="flex flex-col items-center gap-1 text-center">
                    <h1 className="text-2xl font-bold text-foreground">Login to your account</h1>
                    <p className="text-muted-foreground text-sm text-balance">
                        Enter your email below to login to your account
                    </p>
                </div>

                {error && (
                    <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md text-center">
                        {error}
                    </div>
                )}

                <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        required
                        value={email}
                        onChange={function (e) { setEmail(e.target.value) }}
                    />
                </Field>
                <Field>
                    <div className="flex items-center">
                        <FieldLabel htmlFor="password">Password</FieldLabel>
                    </div>
                    <Input
                        id="password"
                        type="password"
                        required
                        value={password}
                        onChange={function (e) { setPassword(e.target.value) }}
                    />
                </Field>
                <Field>
                    <Button type="submit" disabled={loading} className="w-full">
                        {loading ? "Logging in..." : "Login"}
                    </Button>
                </Field>
            </FieldGroup>
        </form>
    )
}
