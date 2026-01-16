import Link from "next/link";
import {
    FileDocument as FileText,
    Image01 as ImageIcon,
    FileDocument as FileSpreadsheet,
    FileDocument as Presentation,
    FileBlank as FileType,
    ArrowRightMd as ArrowRight,
    Settings as Wrench
} from "react-coolicons";
import { toolCategories } from "@/lib/tools-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
    title: "All Free OCR & PDF Tools | InfyGalaxy",
    description: "Access our complete collection of free online OCR and document conversion tools. Convert between PDF, Word, Excel, PPT, and Image formats instantly.",
};

const categoryIcons: Record<string, any> = {
    "PDF Tools": FileText,
    "Word Tools": FileType,
    "Image Tools": ImageIcon,
    "Excel Tools": FileSpreadsheet,
    "PPT Tools": Presentation,
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
                    </div>
                </div>
            </div>

            {/* Tools Grid */}
            <div className="container mx-auto px-4 py-16">
                <div className="grid gap-16">
                    {toolCategories.map((category) => {
                        const Icon = categoryIcons[category.name] || FileText;
                        const style = categoryColors[category.name] || "text-gray-600 bg-gray-50 border-gray-100";

                        return (
                            <div key={category.name} id={category.name.toLowerCase().replace(/\s+/g, '-')}>
                                <div className="flex items-center gap-4 mb-8">
                                    <div className={`p-3 rounded-2xl border ${style} shadow-sm`}>
                                        <Icon className="w-8 h-8" />
                                    </div>
                                    <h2 className="text-3xl font-bold text-gray-900">{category.name}</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {category.items.map((tool) => (
                                        <Link key={tool.href} href={tool.href} className="group">
                                            <Card className="h-full hover:shadow-lg transition-all duration-300 border-gray-200 hover:border-red-200 group-hover:-translate-y-1">
                                                <CardHeader className="pb-4">
                                                    <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                                                        {tool.label}
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <CardDescription className="text-sm text-gray-500 mb-6">
                                                        Easily {tool.label.toLowerCase()} with high accuracy and speed.
                                                    </CardDescription>
                                                    <div className="flex items-center text-sm font-semibold text-red-600 gap-2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0 duration-300">
                                                        Use Tool <ArrowRight className="w-4 h-4" />
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
            </div>
        </div>
    );
}
