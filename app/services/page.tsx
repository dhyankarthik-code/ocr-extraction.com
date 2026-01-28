import React from "react";
import Image from "next/image";
import {
    Stethoscope,
    ShoppingBag,
    FileText,
    DollarSign,
    Scale,
    Fuel,
    Truck,
    Utensils,
    Hotel,
    Plane,
    Landmark,
    Car,
    Radio,
    Briefcase
} from "lucide-react";
import { ToolsCTA } from "@/components/tools/tools-cta";

export const metadata = {
    title: "Enterprise AI Orchestration | Scalable Agentic Solutions",
    description: "Scale your operation with high-performance AI Orchestration and Agentic workflows. Custom enterprise solutions for Healthcare, Finance, Logistics, and Global Trade.",
    alternates: {
        canonical: '/services',
    },
};

interface ServiceSection {
    title: string;
    icon: React.ReactNode;
    image: string;
    altText: string;
    items: {
        title: string;
        description: string;
    }[];
}

const services: ServiceSection[] = [
    // Row 1: Manufacturing, Healthcare, Retail
    {
        title: "Manufacturing",
        icon: <Briefcase className="w-6 h-6 text-blue-600" />,
        image: "/services-images/OCR Extraction Website Archs/Manufacturing.png",
        altText: "Manufacturing OCR automation workflow diagram showing Inventory Labeling, Quality Assurance testing, IoT Data Capture, and Technical Documentation digitization processes.",
        items: [
            {
                title: "Inventory Labeling",
                description: "Converts non-text inventory data to digital text for easy interpretation and analytics.",
            },
            {
                title: "Quality Assurance",
                description: "Rigorous testing ensures superior quality without any data loss.",
            },
            {
                title: "IoT Data Capture",
                description: "Converts IoT data to text for storage, analytics, and reporting.",
            },
            {
                title: "Technical Documentation",
                description: "Digitizes functional and technical documentation for easy reference.",
            },
        ],
    },
    {
        title: "Healthcare",
        icon: <Stethoscope className="w-6 h-6 text-blue-500" />,
        image: "/services-images/OCR Extraction Website Archs/Health Care.png",
        altText: "Healthcare document processing OCR system illustrating Medical Record Digitization, EMR System Integration, Clinical Summaries, and specific Data Security measures.",
        items: [
            {
                title: "Medical Record Digitization",
                description: "Converts prescriptions, lab reports, and patient files into structured digital text.",
            },
            {
                title: "System Integration",
                description: "Seamlessly integrates with EMR/EHR systems and digital health records.",
            },
            {
                title: "Clinical Summaries & Analytics",
                description: "Generates summaries and insights for faster diagnosis and reporting.",
            },
            {
                title: "Data Security & Accuracy",
                description: "Ensures no data loss and maintains compliance standards.",
            },
        ],
    },
    {
        title: "Retail",
        icon: <ShoppingBag className="w-6 h-6 text-green-500" />,
        image: "/services-images/OCR Extraction Website Archs/Retail.png",
        altText: "Retail industry OCR workflow diagram demonstrating Invoice & Receipt Capture, Inventory Label Extraction, Sales Analytics, and Real-Time Data Processing.",
        items: [
            {
                title: "Invoice & Receipt Capture",
                description: "Digitizes purchase orders, receipts, and billing documents.",
            },
            {
                title: "Inventory Label Extraction",
                description: "Converts shelf labels and stock data into usable digital records.",
            },
            {
                title: "Sales & Supplier Analytics",
                description: "Analyzes data to identify trends and vendor performance.",
            },
            {
                title: "Real-Time Processing",
                description: "Enables faster inventory reconciliation and pricing decisions.",
            },
        ],
    },

    // Row 2: Banking, Automobile, Telecom
    {
        title: "Banking & Financial Services",
        icon: <Landmark className="w-6 h-6 text-emerald-700" />,
        image: "/services-images/OCR Extraction Website Archs/Banking & Financial Services.png",
        altText: "Banking and Financial Services OCR automation diagram depicting KYC & Onboarding Capture, Loan & Statement Processing, and Audit Compliance workflows.",
        items: [
            {
                title: "KYC & Onboarding Capture",
                description: "Digitizes identity and compliance documents.",
            },
            {
                title: "Loan & Statement Processing",
                description: "Extracts and structures financial records.",
            },
            {
                title: "Secure Data Handling",
                description: "Ensures confidentiality and regulatory compliance.",
            },
            {
                title: "Audit & Compliance Analytics",
                description: "Supports reporting and risk assessment.",
            },
        ],
    },
    {
        title: "Automobile",
        icon: <Car className="w-6 h-6 text-slate-600" />,
        image: "/services-images/OCR Extraction Website Archs/Automobile.png",
        altText: "Automobile industry OCR process flow showing Service & Inspection Records digitization, Warranty & Invoice Capture, and Supply Chain Documentation management.",
        items: [
            {
                title: "Service & Inspection Records",
                description: "Digitizes maintenance and inspection documents.",
            },
            {
                title: "Warranty & Invoice Capture",
                description: "Automates document processing across dealerships.",
            },
            {
                title: "Supply Chain Documentation",
                description: "Structures vendor and logistics data.",
            },
            {
                title: "Quality & Production Analytics",
                description: "Improves manufacturing and after-sales insights.",
            },
        ],
    },
    {
        title: "Telecom",
        icon: <Radio className="w-6 h-6 text-violet-500" />,
        image: "/services-images/OCR Extraction Website Archs/Telecom.png",
        altText: "Telecom sector OCR solutions diagram illustrating Subscriber ID Verification, Bill Processing, Installation Logs digitization, and Customer Service analytics.",
        items: [
            {
                title: "Customer Onboarding Documents",
                description: "Digitizes contracts and ID documents.",
            },
            {
                title: "Billing & Invoice Processing",
                description: "Extracts and validates billing data.",
            },
            {
                title: "Operational Data Capture",
                description: "Converts network and service records into text.",
            },
            {
                title: "Performance Analytics",
                description: "Enables data-driven operational decisions.",
            },
        ],
    },

    // Row 3: Energy, Travel, Hospitality
    {
        title: "Energy",
        icon: <Fuel className="w-6 h-6 text-orange-600" />,
        image: "/services-images/OCR Extraction Website Archs/Oil & Gas.png",
        altText: "Energy industry OCR workflow for Inspection Safety Data, Operational Document Processing, Compliance Reporting, and Operational Analytics.",
        items: [
            {
                title: "Inspection & Safety Data Capture",
                description: "Digitizes safety logs and inspection reports.",
            },
            {
                title: "Operational Document Processing",
                description: "Converts drilling and maintenance records into text.",
            },
            {
                title: "Compliance Reporting",
                description: "Supports regulatory and audit requirements.",
            },
            {
                title: "Operational Analytics",
                description: "Provides insights for performance and risk management.",
            },
        ],
    },
    {
        title: "Travel",
        icon: <Plane className="w-6 h-6 text-sky-500" />,
        image: "/services-images/OCR Extraction Website Archs/Travel.png",
        altText: "Travel industry OCR automation for Ticket & Itinerary Digitization, Invoice Processing, Booking Data Analytics, and Customer Servicing acceleration.",
        items: [
            {
                title: "Ticket & Itinerary Digitization",
                description: "Converts travel documents into structured data.",
            },
            {
                title: "Invoice & Vendor Processing",
                description: "Automates back-office documentation.",
            },
            {
                title: "Booking Data Analytics",
                description: "Improves planning and cost control.",
            },
            {
                title: "Faster Customer Servicing",
                description: "Reduces manual processing delays.",
            },
        ],
    },
    {
        title: "Hospitality",
        icon: <Hotel className="w-6 h-6 text-indigo-500" />,
        image: "/services-images/OCR Extraction Website Archs/Hospitality.png",
        altText: "Hospitality sector OCR systems showing Guest Document Capture, Procurement Processing, Centralized Data Management, and Operational Analytics.",
        items: [
            {
                title: "Guest & Vendor Document Capture",
                description: "Digitizes booking, billing, and vendor records.",
            },
            {
                title: "Invoice & Procurement Processing",
                description: "Automates financial document handling.",
            },
            {
                title: "Centralized Data Management",
                description: "Stores all documents in a unified digital system.",
            },
            {
                title: "Operational Analytics",
                description: "Identifies cost savings and service improvement opportunities.",
            },
        ],
    },

    // Row 4+: Food & Beverages, Legal, Documentation, Logistics, Finance
    {
        title: "Food & Beverages",
        icon: <Utensils className="w-6 h-6 text-red-500" />,
        image: "/services-images/OCR Extraction Website Archs/Food & Beverages.png",
        altText: "Food & Beverages industry OCR for Quality Control Documentation, Label Data Capture, Inventory Analysis, and Regulatory Reporting.",
        items: [
            {
                title: "Quality Control Documentation",
                description: "Digitizes production and quality inspection logs.",
            },
            {
                title: "Label & Packaging Data Capture",
                description: "Extracts data for traceability and compliance.",
            },
            {
                title: "Inventory & Supplier Analysis",
                description: "Supports stock optimization and vendor monitoring.",
            },
            {
                title: "Regulatory Reporting",
                description: "Ensures adherence to food safety standards.",
            },
        ],
    },
    {
        title: "Legal",
        icon: <Scale className="w-6 h-6 text-purple-600" />,
        image: "/services-images/OCR Extraction Website Archs/Legal.png",
        altText: "Legal industry OCR document management flow: Contract Analysis, Case File Digitization, Compliance Discovery, and Archival Search implementation.",
        items: [
            {
                title: "Contract & Case File Digitization",
                description: "Converts legal documents into structured digital text.",
            },
            {
                title: "Handwritten Text Recognition",
                description: "Accurately captures notes and legacy documents.",
            },
            {
                title: "Searchable Legal Records",
                description: "Enables faster document discovery and review.",
            },
            {
                title: "Case Analytics & Summaries",
                description: "Supports efficient legal analysis and case preparation.",
            },
        ],
    },
    {
        title: "Documentation & Records",
        icon: <FileText className="w-6 h-6 text-gray-500" />,
        image: "/services-images/OCR Extraction Website Archs/Documentation & Records.png",
        altText: "General Documentation & Records OCR process showing Document Digitization, Automated Indexing, Data Summarization, and Compliance Storage.",
        items: [
            {
                title: "Document Digitization",
                description: "Converts physical and scanned documents into searchable text.",
            },
            {
                title: "Automated Indexing",
                description: "Organizes documents for quick retrieval and reference.",
            },
            {
                title: "Data Summarization",
                description: "Creates concise summaries for faster review.",
            },
            {
                title: "Compliance-Ready Storage",
                description: "Supports audits and regulatory requirements.",
            },
        ],
    },
    {
        title: "Logistics & Supply Chain",
        icon: <Truck className="w-6 h-6 text-yellow-600" />,
        image: "/services-images/OCR Extraction Website Archs/Logistics & Supply Chain.png",
        altText: "Logistics & Supply Chain OCR diagram illustrating Shipping Document Digitization, Inventory Records, Automated Data Routing, and Logistics Analytics.",
        items: [
            {
                title: "Shipping Document Digitization",
                description: "Extracts data from bills of lading and delivery notes.",
            },
            {
                title: "Inventory & Warehouse Records",
                description: "Structures inventory movement data.",
            },
            {
                title: "Automated Data Routing",
                description: "Sends data to ERP or warehouse systems.",
            },
            {
                title: "Logistics Analytics",
                description: "Improves shipment tracking and vendor performance visibility.",
            },
        ],
    },
    {
        title: "Finance",
        icon: <DollarSign className="w-6 h-6 text-emerald-600" />,
        image: "/services-images/OCR Extraction Website Archs/Finance.png",
        altText: "Finance sector OCR automation workflow for Financial Document Extraction, Data Validation, Automated Reporting, and Compliance Support.",
        items: [
            {
                title: "Financial Document Extraction",
                description: "Digitizes invoices, statements, and tax records.",
            },
            {
                title: "Data Structuring & Validation",
                description: "Ensures accuracy before routing into financial systems.",
            },
            {
                title: "Automated Reporting",
                description: "Generates summaries for reconciliation and audits.",
            },
            {
                title: "Risk & Compliance Support",
                description: "Reduces manual errors and compliance gaps.",
            },
        ],
    },
];

export default function ServicesPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Enterprise Header Section */}
                <div className="max-w-6xl mx-auto mb-20 text-center group">
                    <div className="bg-white/80 backdrop-blur-xl p-10 md:p-16 rounded-[3rem] border border-white/20 shadow-2xl shadow-gray-200/50 relative overflow-hidden transition-all duration-500 hover:shadow-red-500/10 hover:-translate-y-2">
                        {/* Animated Premium Border */}
                        <div className="absolute top-0 left-0 w-full h-2 bg-gray-50/50"></div>
                        <div className="absolute top-0 left-0 w-0 group-hover:w-full h-2 bg-gradient-to-r from-red-600 via-orange-500 to-yellow-400 transition-all duration-1000 ease-in-out"></div>

                        <div className="relative z-10">
                            <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight mb-6">
                                Enterprise & <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">SME AI Orchestration</span>
                            </h1>

                            <p className="max-w-4xl mx-auto text-lg md:text-xl text-gray-600 leading-relaxed font-medium mb-8">
                                Accelerate your Business Goals and Growth with scalable Agentic AI solutions. We architect intelligent workflows that harmonize Super Agents with your core infrastructure, driving exponential efficiency and measurable business impact.
                            </p>

                            <div className="grid lg:grid-cols-2 gap-6 text-left mb-8">
                                {/* Card 1: Operations */}
                                <div className="relative p-1 bg-gradient-to-br from-red-500/20 to-orange-500/10 rounded-[2.5rem] group/card overflow-hidden">
                                    <div className="absolute inset-0 bg-white group-hover/card:bg-red-50/50 transition-colors duration-500"></div>
                                    <div className="relative p-8 flex flex-col h-full">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-200 group-hover/card:scale-110 transition-transform duration-500">
                                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-2xl font-black text-gray-900 tracking-tight">Autonomous Operations</h3>
                                        </div>
                                        <div className="space-y-4 flex-grow">
                                            <div className="flex items-start gap-4 p-4 bg-white/50 rounded-2xl border border-red-100 transition-all hover:border-red-300">
                                                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                                    <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900">24/7 Persistent Processing</p>
                                                    <p className="text-sm text-gray-600 mt-1">Eliminate downtime with autonomous agents that maintain peak productivity around the clock.</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-4 p-4 bg-white/50 rounded-2xl border border-red-100 transition-all hover:border-red-300">
                                                <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                                    <svg className="w-3.5 h-3.5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900">Real-Time Data Intelligence</p>
                                                    <p className="text-sm text-gray-600 mt-1">Instant visibility into operational performance via sophisticated AI-driven analytics dashboards.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Card 2: Strategy */}
                                <div className="relative p-1 bg-gradient-to-br from-blue-500/20 to-indigo-500/10 rounded-[2.5rem] group/card overflow-hidden">
                                    <div className="absolute inset-0 bg-white group-hover/card:bg-blue-50/50 transition-colors duration-500"></div>
                                    <div className="relative p-8 flex flex-col h-full">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 group-hover/card:scale-110 transition-transform duration-500">
                                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-2xl font-black text-gray-900 tracking-tight">Strategic Growth</h3>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {[
                                                { label: "Optimal Production", icon: "⚙️" },
                                                { label: "Revenue Acceleration", icon: "📈" },
                                                { label: "Profit Maximization", icon: "💰" },
                                                { label: "Determined Potential", icon: "🚀" }
                                            ].map((item, idx) => (
                                                <div key={idx} className="flex items-center gap-3 p-3 bg-white/80 rounded-xl border border-blue-50 transition-all hover:shadow-sm hover:border-blue-200 hover:scale-[1.02]">
                                                    <span className="text-xl">{item.icon}</span>
                                                    <span className="text-sm font-bold text-gray-800">{item.label}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <p className="mt-6 text-sm text-gray-500 font-medium italic">Empowering your human workforce to focus on high-value strategy and creative output.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Contact CTA */}
                            <div className="pt-4">
                                <ToolsCTA />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Industry Grid */}
                <div className="flex flex-col gap-10">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className="w-full bg-white shadow-2xl rounded-[3rem] overflow-hidden transition-all duration-700 border border-gray-100 flex flex-col md:flex-row group hover:shadow-red-500/10 hover:-translate-y-2 relative"
                        >
                            {/* Premium Border Decor */}
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-50/50"></div>
                            <div className="absolute top-0 left-0 w-0 group-hover:w-full h-1.5 bg-gradient-to-r from-red-600 via-orange-500 to-yellow-400 transition-all duration-1000 ease-in-out"></div>

                            {/* Content Section - Left Side */}
                            <div className="p-8 md:w-1/2 flex flex-col justify-center order-2 md:order-1 relative z-10 bg-white group-hover:bg-gray-50/30 transition-colors duration-700">
                                <div className="flex items-center gap-5 mb-6">
                                    <div className="bg-gradient-to-br from-white to-gray-50 w-20 h-20 rounded-[1.5rem] shadow-xl flex items-center justify-center flex-shrink-0 border border-gray-100 transition-all duration-700 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-red-600/20 group-hover:border-red-100">
                                        {React.cloneElement(service.icon as any, { className: "w-8 h-8 text-gray-900 group-hover:text-red-600 transition-colors duration-700" })}
                                    </div>
                                    <div>
                                        <h3 className="text-3xl font-black text-gray-900 leading-tight tracking-tight group-hover:text-red-600 transition-colors duration-700">{service.title}</h3>
                                        <p className="text-sm font-black text-red-500/60 tracking-[0.2em] uppercase mt-1">Enterprise Intelligence</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {service.items.map((item, i) => (
                                        <div key={i} className="group/item">
                                            <h4 className="font-black text-gray-900 text-xl mb-3 group-hover/item:text-red-600 transition-colors flex items-center gap-4">
                                                <span className="w-3 h-3 bg-red-600 rounded-full group-hover/item:scale-125 transition-transform shadow-lg shadow-red-200"></span>
                                                {item.title}
                                            </h4>
                                            <p className="text-base text-gray-500 leading-relaxed font-medium pl-7">
                                                {item.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Image Section - Right Side */}
                            <div className="md:w-1/2 relative bg-gray-50/50 order-1 md:order-2 min-h-[450px] md:min-h-full p-4 flex items-center justify-center overflow-hidden">
                                <div className="relative w-full h-full min-h-[450px] md:min-h-[550px] rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-1000 ease-out group-hover:scale-[1.03] group-hover:shadow-red-900/10">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10 transition-opacity duration-700 group-hover:opacity-30 opacity-60"></div>
                                    <Image
                                        src={service.image}
                                        alt={service.altText}
                                        fill
                                        className="object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-110"
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                    />
                                    <div className="absolute bottom-8 left-8 right-8 z-20 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-700">
                                        <p className="text-white text-lg font-black tracking-widest uppercase border-l-4 border-red-600 pl-4">{service.title} Solutions</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
