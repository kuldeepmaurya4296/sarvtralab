'use client';
import { useState } from 'react';
import { Upload, FileSpreadsheet, Users, CheckCircle, AlertCircle, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface BulkEnrollmentDialogProps {
  trigger?: React.ReactNode;
  type: 'school' | 'govt';
}

const BulkEnrollmentDialog = ({ trigger, type }: BulkEnrollmentDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'upload' | 'preview' | 'success'>('upload');
  const [file, setFile] = useState<File | null>(null);

  const mockPreviewData = [
    { name: 'Aarav Kumar', email: 'aarav.k@student.com', grade: 'Class 5', parentPhone: '+91 98765 11111' },
    { name: 'Ishita Patel', email: 'ishita.p@student.com', grade: 'Class 6', parentPhone: '+91 98765 22222' },
    { name: 'Vivaan Singh', email: 'vivaan.s@student.com', grade: 'Class 5', parentPhone: '+91 98765 33333' },
    { name: 'Ananya Sharma', email: 'ananya.s@student.com', grade: 'Class 7', parentPhone: '+91 98765 44444' },
    { name: 'Reyansh Gupta', email: 'reyansh.g@student.com', grade: 'Class 6', parentPhone: '+91 98765 55555' },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = () => {
    if (file) {
      setStep('preview');
    }
  };

  const handleConfirm = () => {
    setStep('success');
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      setStep('upload');
      setFile(null);
    }, 300);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Users className="w-4 h-4 mr-2" />
            Bulk Enroll Students
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {step === 'upload' && 'Bulk Student Enrollment'}
            {step === 'preview' && 'Preview Enrollment Data'}
            {step === 'success' && 'Enrollment Successful'}
          </DialogTitle>
        </DialogHeader>

        {step === 'upload' && (
          <div className="space-y-6 py-4">
            <div className="text-center p-8 border-2 border-dashed rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer">
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileChange}
                className="hidden"
                id="bulk-upload"
              />
              <label htmlFor="bulk-upload" className="cursor-pointer">
                <FileSpreadsheet className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="font-medium mb-1">
                  {file ? file.name : 'Drop your file here or click to browse'}
                </p>
                <p className="text-sm text-muted-foreground">
                  Supports CSV, XLS, XLSX (max 1000 students)
                </p>
              </label>
            </div>

            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Download className="w-4 h-4" />
                Download Template
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                Use our template to ensure correct formatting for bulk enrollment.
              </p>
              <Button variant="outline" size="sm">
                Download CSV Template
              </Button>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={handleClose}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={handleUpload} disabled={!file}>
                <Upload className="w-4 h-4 mr-2" />
                Upload & Preview
              </Button>
            </div>
          </div>
        )}

        {step === 'preview' && (
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
              <div className="flex items-center gap-2 text-success">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">{mockPreviewData.length} students ready to enroll</span>
              </div>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <div className="max-h-64 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted sticky top-0">
                    <tr>
                      <th className="text-left p-3 font-medium">Name</th>
                      <th className="text-left p-3 font-medium">Email</th>
                      <th className="text-left p-3 font-medium">Grade</th>
                      <th className="text-left p-3 font-medium">Parent Phone</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockPreviewData.map((student, index) => (
                      <tr key={index} className="border-t hover:bg-muted/30">
                        <td className="p-3">{student.name}</td>
                        <td className="p-3">{student.email}</td>
                        <td className="p-3">{student.grade}</td>
                        <td className="p-3">{student.parentPhone}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setStep('upload')}>
                Back
              </Button>
              <Button className="flex-1" onClick={handleConfirm}>
                Confirm Enrollment
              </Button>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Enrollment Complete!</h3>
            <p className="text-muted-foreground mb-6">
              {mockPreviewData.length} students have been successfully enrolled.<br />
              Login credentials have been sent to their email addresses.
            </p>
            <Button onClick={handleClose}>
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BulkEnrollmentDialog;


