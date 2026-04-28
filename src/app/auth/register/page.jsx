
"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";

const registrationSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    businessEmail: z.string().email("Valid email is required"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain uppercase letter")
        .regex(/[0-9]/, "Password must contain number"),
    role: z.enum(["Individual", "Partner"]),
    termsAgreed: z.boolean().refine((val) => val === true, {
        message: "You must agree to the terms",
    }),
});

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(registrationSchema),
        defaultValues: {
            role: "Individual",
            termsAgreed: false,
        },
    });

    const password = watch("password");

    const getPasswordStrength = () => {
        if (!password) return "";
        if (password.length < 8) return "Weak";
        if (password.match(/[A-Z]/) && password.match(/[0-9]/) && password.length >= 12) {
            return "Strong";
        }
        return "Medium";
    };

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            const payload = {
                name: `${data.firstName} ${data.lastName}`.trim(),
                email: data.businessEmail,
                password: data.password,
                role: data.role === "Partner" ? "COMPANY" : "USER",
                phone: "-",
            };

            const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error("Registration failed");
            }

            const result = await response.json();
            console.log("Registration success:", result);
        } catch (error) {
            console.error("Registration error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white">
            <div className="hidden lg:flex flex-col justify-between p-12 bg-linear-to-br from-green-700 to-green-900 text-white">
                <div>
                    <h1 className="text-4xl font-bold mb-2">AMERTA</h1>
                    <p className="text-2xl font-light leading-tight">
                        Advancing the Circular Textile Economy.
                    </p>
                    <p className="text-green-100 mt-4 text-sm">
                        Join our ecosystem of professional recyclers, brands, and logistics
                        partners managing the global textile lifecycle with data-driven
                        precision.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white bg-opacity-20 p-6 rounded-lg backdrop-blur-sm">
                        <div className="text-2xl mb-2">♻️</div>
                        <h3 className="font-semibold">CLOSED LOOP</h3>
                        <p className="text-sm text-green-100">98% efficiency in material tracing.</p>
                    </div>
                    <div className="bg-white bg-opacity-20 p-6 rounded-lg backdrop-blur-sm">
                        <div className="text-2xl mb-2">📊</div>
                        <h3 className="font-semibold">IMPACT REPORTS</h3>
                        <p className="text-sm text-green-100">Real-time ESG data for partners.</p>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <div className="mb-8 lg:hidden">
                        <h1 className="text-3xl font-bold text-green-700">AMERTA</h1>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-2xl font-semibold text-gray-900">Create Account</h2>
                        <p className="text-gray-600 text-sm">Set up your workspace to start managing materials.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <button type="button" className="flex items-center justify-center border border-gray-300 py-2.5 rounded-lg hover:bg-gray-50 transition">
                            <span className="text-lg">🔵</span>
                            <span className="ml-2 text-sm font-medium">Google</span>
                        </button>
                        <button type="button" className="flex items-center justify-center border border-gray-300 py-2.5 rounded-lg hover:bg-gray-50 transition">
                            <span className="text-lg">🔐</span>
                            <span className="ml-2 text-sm font-medium">SSO</span>
                        </button>
                    </div>

                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">OR USE EMAIL</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">FIRST NAME</label>
                                <input
                                    {...register("firstName")}
                                    placeholder="John"
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                                />
                                {errors.firstName && <p className="text-xs text-red-600 mt-1">{errors.firstName.message}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">LAST NAME</label>
                                <input
                                    {...register("lastName")}
                                    placeholder="Doe"
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                                />
                                {errors.lastName && <p className="text-xs text-red-600 mt-1">{errors.lastName.message}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">BUSINESS EMAIL</label>
                            <input
                                {...register("businessEmail")}
                                type="email"
                                placeholder="john.doe@company.com"
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                            />
                            {errors.businessEmail && <p className="text-xs text-red-600 mt-1">{errors.businessEmail.message}</p>}
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <label className="block text-xs font-semibold text-gray-700">PASSWORD</label>
                                {password && (
                                    <span
                                        className={`text-xs font-medium ${
                                            getPasswordStrength() === "Strong"
                                                ? "text-green-600"
                                                : getPasswordStrength() === "Medium"
                                                  ? "text-yellow-600"
                                                  : "text-red-600"
                                        }`}
                                    >
                                        {getPasswordStrength()}
                                    </span>
                                )}
                            </div>
                            <div className="relative">
                                <input
                                    {...register("password")}
                                    type={showPassword ? "text" : "password"}
                                    placeholder="........"
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-3">I AM JOINING AS</label>
                            <div className="grid grid-cols-2 gap-3">
                                <label className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-green-600 transition">
                                    <input
                                        {...register("role")}
                                        type="radio"
                                        value="Individual"
                                        className="w-4 h-4 text-green-600"
                                    />
                                    <div className="ml-3">
                                        <p className="font-semibold text-sm">Individual</p>
                                        <p className="text-xs text-gray-600">Freelancer or independent</p>
                                    </div>
                                </label>
                                <label className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-green-600 transition">
                                    <input
                                        {...register("role")}
                                        type="radio"
                                        value="Partner"
                                        className="w-4 h-4 text-green-600"
                                    />
                                    <div className="ml-3">
                                        <p className="font-semibold text-sm">Partner</p>
                                        <p className="text-xs text-gray-600">Business or institution</p>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <label className="flex items-start gap-2 mt-4">
                            <input {...register("termsAgreed")} type="checkbox" className="mt-1 w-4 h-4 text-green-600 rounded" />
                            <span className="text-xs text-gray-700">
                                I agree to the{" "}
                                <Link href="#" className="text-green-600 hover:underline font-medium">
                                    Terms of Service
                                </Link>
                                {" "}and{" "}
                                <Link href="#" className="text-green-600 hover:underline font-medium">
                                    Privacy Policy
                                </Link>
                                .
                            </span>
                        </label>
                        {errors.termsAgreed && <p className="text-xs text-red-600">{errors.termsAgreed.message}</p>}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-3 rounded-lg mt-6 transition disabled:opacity-50"
                        >
                            {isLoading ? "Creating Account..." : "Create Account"}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-600 mt-4">
                        Already a member?{" "}
                        <Link href="/auth/login" className="text-green-600 hover:underline font-semibold">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>

            <footer className="col-span-full border-t border-gray-200 py-4 px-8 text-center text-xs text-gray-600">
                © 2024 AMERTA Textile Lifecycle Management.{" "}
                <Link href="#" className="hover:underline">Privacy</Link> •{" "}
                <Link href="#" className="hover:underline">Terms</Link> •{" "}
                <Link href="#" className="hover:underline">Support</Link>
            </footer>
        </div>
    );
}