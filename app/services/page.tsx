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

export const metadata = {
    title: "Industry Solutions | Free OCR Services",
    description: "AI-powered OCR solutions for Healthcare, Retail, Finance, Legal, and more. Transform your business documentation with our advanced text extraction services.",
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
                {/* Header Section */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-4">
                        AI Solutions for All Industries
                    </h1>
                    <p className="max-w-4xl mx-auto text-xl text-gray-600 leading-relaxed">
                        We provide various AI solutions to all the industries. Whether setting up Agentic AI,
                        planning the workflows and orchestrating the Agents and Super Agents and make them
                        seamlessly work for improved efficiency and outstanding results. The Agents work 24/7.
                        You get the real time analytics. Production is improvised, sales is increased, profits are
                        rationalized and people are determined more than ever.
                    </p>
                </div>

                {/* Industry Grid */}
                <div className="flex flex-col gap-8">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className="w-full bg-white shadow-lg overflow-hidden transition-shadow duration-300 border border-gray-100 flex flex-col md:flex-row group hover:shadow-2xl"
                        >
                            {/* Content Section - Left Side */}
                            <div className="p-8 md:w-1/2 flex flex-col justify-center order-2 md:order-1">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:bg-red-50">
                                        {React.cloneElement(service.icon as any, { className: "w-6 h-6 text-blue-600 group-hover:text-red-600 transition-colors" })}
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 group-hover:text-red-600 transition-colors duration-300">{service.title}</h3>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {service.items.map((item, i) => (
                                        <div key={i} className="group">
                                            <h4 className="font-semibold text-gray-800 text-base mb-2 group-hover:text-blue-600 transition-colors flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full inline-block group-hover:bg-red-500 transition-colors"></span>
                                                {item.title}
                                            </h4>
                                            <p className="text-sm text-gray-600 leading-relaxed pl-3.5">
                                                {item.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Image Section - Right Side */}
                            <div className="md:w-1/2 relative bg-white order-1 md:order-2 min-h-[300px] md:min-h-full p-3 flex items-center justify-center">
                                <div className="relative w-full h-full min-h-[300px] md:min-h-[400px] overflow-hidden shadow-sm transition-all duration-500 ease-out group-hover:shadow-[0_0_60px_-15px_rgba(220,38,38,0.7)]">
                                    <Image
                                        src={service.image}
                                        alt={service.altText}
                                        fill
                                        className="object-cover transition-transform duration-700"
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

