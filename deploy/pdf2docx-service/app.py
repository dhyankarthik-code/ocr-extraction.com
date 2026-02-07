"""
pdf2docx Microservice
High-fidelity PDF to Word conversion with layout preservation
"""
from flask import Flask, request, send_file, jsonify
from pdf2docx import Converter
import tempfile
import os
import uuid

app = Flask(__name__)

# Max file size: 50MB
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "service": "pdf2docx"})

@app.route('/convert', methods=['POST'])
def convert_pdf_to_docx():
    """
    Convert PDF to DOCX with full layout preservation
    
    Request: multipart/form-data with 'file' field containing PDF
    Response: DOCX file download
    """
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400
    
    if not file.filename.lower().endswith('.pdf'):
        return jsonify({"error": "File must be a PDF"}), 400
    
    # Create temp directory for processing
    temp_dir = tempfile.mkdtemp()
    unique_id = str(uuid.uuid4())[:8]
    
    pdf_path = os.path.join(temp_dir, f"{unique_id}.pdf")
    docx_path = os.path.join(temp_dir, f"{unique_id}.docx")
    
    try:
        # Save uploaded PDF
        file.save(pdf_path)
        
        # Convert with pdf2docx (preserves layout, images, colors)
        cv = Converter(pdf_path)
        cv.convert(docx_path)
        cv.close()
        
        # Send the converted file
        return send_file(
            docx_path,
            as_attachment=True,
            download_name=file.filename.replace('.pdf', '.docx'),
            mimetype='application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        )
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
    finally:
        # Cleanup temp files
        try:
            if os.path.exists(pdf_path):
                os.remove(pdf_path)
            if os.path.exists(docx_path):
                os.remove(docx_path)
            os.rmdir(temp_dir)
        except:
            pass

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)
