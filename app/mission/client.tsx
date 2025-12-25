"use client"




export default function MissionPage() {
    return (
        <div className="bg-gray-50 flex-1 py-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <article className="prose prose-lg max-w-none bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Our Mission</h1>

                    <div className="space-y-6 text-gray-700">
                        <p className="lead text-xl">
                            We give the online OCR - optical character recognition technology extraction service for free without any kind of hidden price whatsoever.
                            We also have value added on top of the data extraction service such as providing summary of the extracted data for ease of understanding using artificial intelligence - AI, reporting, creating structure based on your inputs, ability to download in any format that you prefer.
                        </p>

                        <p>
                            We use the latest and most sophisticated models to ensure greater accuracy in converting images and scanned documents into editable, summarizable, searchable, and reportable formats.
                        </p>
                    </div>
                </article>
            </div>
        </div>
    )
}
