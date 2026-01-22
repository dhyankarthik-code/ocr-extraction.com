// Modern file type icons with premium aesthetics
export const PdfIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="8" y="4" width="40" height="48" rx="4" fill="#EF4444" />
        <path d="M32 4L48 20H36C33.7909 20 32 18.2091 32 16V4Z" fill="#DC2626" />
        <text x="28" y="36" fontSize="14" fontWeight="700" fill="white" textAnchor="middle" fontFamily="system-ui, -apple-system, sans-serif">PDF</text>
    </svg>
);

export const WordIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="8" y="4" width="40" height="48" rx="4" fill="#2563EB" />
        <path d="M32 4L48 20H36C33.7909 20 32 18.2091 32 16V4Z" fill="#1D4ED8" />
        <text x="28" y="36" fontSize="13" fontWeight="700" fill="white" textAnchor="middle" fontFamily="system-ui, -apple-system, sans-serif">DOC</text>
    </svg>
);

export const ExcelIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="8" y="4" width="40" height="48" rx="4" fill="#10B981" />
        <path d="M32 4L48 20H36C33.7909 20 32 18.2091 32 16V4Z" fill="#059669" />
        <text x="28" y="36" fontSize="14" fontWeight="700" fill="white" textAnchor="middle" fontFamily="system-ui, -apple-system, sans-serif">XLS</text>
    </svg>
);

export const PptIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="8" y="4" width="40" height="48" rx="4" fill="#F97316" />
        <path d="M32 4L48 20H36C33.7909 20 32 18.2091 32 16V4Z" fill="#EA580C" />
        <text x="28" y="36" fontSize="14" fontWeight="700" fill="white" textAnchor="middle" fontFamily="system-ui, -apple-system, sans-serif">PPT</text>
    </svg>
);

export const ImageFileIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="8" y="4" width="40" height="48" rx="4" fill="#8B5CF6" />
        <path d="M32 4L48 20H36C33.7909 20 32 18.2091 32 16V4Z" fill="#7C3AED" />
        <rect x="18" y="22" width="20" height="16" rx="2" fill="white" fillOpacity="0.3" />
        <circle cx="23" cy="28" r="2" fill="white" />
        <path d="M18 35L23 30L27 34L32 29L38 35V36C38 37.1046 37.1046 38 36 38H20C18.8954 38 18 37.1046 18 36V35Z" fill="white" />
    </svg>
);
