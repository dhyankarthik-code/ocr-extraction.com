import Link from "next/link";
import { ArrowRightMd as ArrowRight, Settings as Wrench } from "react-coolicons";
import { toolCategories } from "@/lib/tools-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PdfIcon, WordIcon, ExcelIcon, PptIcon, ImageFileIcon } from "@/components/icons/file-type-icons";
import { ToolsCTA } from "@/components/tools/tools-cta";

export const metadata = {
    title: "All Free OCR & PDF Tools | InfyGalaxy",
    description: "Access our complete collection of free online OCR and document conversion tools. Convert between PDF, Word, Excel, PPT, and Image formats instantly.",
};

const categoryIcons: Record<string, any> = {
    "PDF Tools": PdfIcon,
    "Word Tools": WordIcon,
    "Image Tools": ImageFileIcon,
    "Excel Tools": ExcelIcon,
    "PPT Tools": PptIcon,
};

const categoryColors: Record<string, string> = {
    "PDF Tools": "text-red-600 bg-red-50 border-red-100",
    "Word Tools": "text-blue-600 bg-blue-50 border-blue-100",
    "Image Tools": "text-purple-600 bg-purple-50 border-purple-100",
    "Excel Tools": "text-green-600 bg-green-50 border-green-100",
    "PPT Tools": "text-orange-600 bg-orange-50 border-orange-100",
};

export default function ToolsPage() {
    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Hero Section */}
            <div className="bg-white border-b border-gray-100">
                <div className="container mx-auto px-4 py-16 md:py-24">
                    <div className="max-w-3xl mx-auto text-center space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-600 font-medium text-sm">
                            <Wrench className="w-4 h-4" />
                            <span>Complete Tool Collection</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
                            All the <span className="text-red-600">Tools</span> You Need
                        </h1>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            Simplify your document workflows with our comprehensive suite of conversion and OCR tools.
                            Secure, fast, and 100% free to use.
                        </p>

                        {/* Contact CTA */}
                        <ToolsCTA />
                    </div>
                </div>
            </div>

            {/* Tools Grid */}
            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                    {toolCategories.map((category) => {
                        const Icon = categoryIcons[category.name] || PdfIcon;
                        const style = categoryColors[category.name] || "text-gray-600 bg-gray-50 border-gray-100";

                        return (
                            <div key={category.name} id={category.name.toLowerCase().replace(/\s+/g, '-')} className="flex flex-col">
                                {/* Category Header */}
                                <div className="flex flex-col items-center gap-3 mb-6 pb-4 border-b-2 border-gray-100">
                                    <div className={`p-3 rounded-2xl border ${style} shadow-sm`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900 text-center">{category.name}</h2>
                                </div>

                                {/* Tools List */}
                                <div className="flex flex-col gap-4">
                                    {category.items.map((tool) => (
                                        <Link key={tool.href} href={tool.href} className="group">
                                            <Card className="h-full hover:shadow-lg transition-all duration-300 border-gray-200 hover:border-red-200 group-hover:-translate-y-1">
                                                <CardHeader className="pb-3">
                                                    <CardTitle className="text-base font-bold text-gray-900 group-hover:text-red-600 transition-colors leading-snug">
                                                        {tool.label}
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent className="pt-0">
                                                    <CardDescription className="text-xs text-gray-500 mb-3">
                                                        Easily {tool.label.toLowerCase()} with high accuracy and speed.
                                                    </CardDescription>
                                                    <div className="flex items-center text-xs font-semibold text-red-600 gap-1 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0 duration-300">
                                                        Use Tool <ArrowRight className="w-3 h-3" />
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* The ToolsCTA component was moved to the Hero section, so it's removed from here. */}
            </div>
        </div>
    );
}
