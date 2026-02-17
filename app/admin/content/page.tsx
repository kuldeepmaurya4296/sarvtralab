'use client';

import { useState, useEffect } from 'react';
import {
    FileText,
    Upload,
    Video,
    File,
    Folder,
    Search,
    MoreVertical,
    Download,
    Pencil,
    Share2,
    Trash2,
    ChevronRight,
    Home,
    Check,
    Info,
    Calendar,
    User,
    Layers,
    FileImage,
    FileCode,
    Clock,
    HardDrive
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { mockSuperAdmin } from '@/data/users';
import { courses } from '@/data/courses'; // Import courses for dropdown
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetFooter,
} from "@/components/ui/sheet";
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from '@/components/ui/separator';

export default function AdminContentPage() {
    const admin = mockSuperAdmin;
    const [currentFolderId, setCurrentFolderId] = useState('root');
    const [folderContents, setFolderContents] = useState<{ folders: any[], files: any[], breadcrumbs: any[] }>({ folders: [], files: [], breadcrumbs: [] });
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Action States
    const [isNewFolderOpen, setIsNewFolderOpen] = useState(false);
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [isRenameOpen, setIsRenameOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [viewItem, setViewItem] = useState<any>(null);

    // Form Data
    const [folderName, setFolderName] = useState('');
    const [uploadData, setUploadData] = useState({
        title: '',
        type: 'Video',
        url: '', // For Video URL
        selectedCourses: [] as string[],
        file: null as File | null
    });
    const [renameValue, setRenameValue] = useState('');

    // Fetch Data
    const fetchContent = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/admin/content?folderId=${currentFolderId}`);
            if (res.ok) {
                const data = await res.json();
                setFolderContents(data);
            } else {
                toast.error("Failed to load content");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error loading content");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchContent();
    }, [currentFolderId]);

    // Handlers
    const handleCreateFolder = async () => {
        if (!folderName) return;
        try {
            const res = await fetch('/api/admin/content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'createFolder',
                    name: folderName,
                    parentId: currentFolderId
                })
            });
            if (res.ok) {
                toast.success("Folder created successfully");
                setIsNewFolderOpen(false);
                setFolderName('');
                fetchContent();
            } else {
                toast.error("Failed to create folder");
            }
        } catch (error) {
            toast.error("Error creating folder");
        }
    };

    const handleUpload = async () => {
        if (!uploadData.title) {
            toast.error("Title is required");
            return;
        }

        // Validate Video URL
        if (uploadData.type === 'Video' && !uploadData.url) {
            toast.error("Video URL is required");
            return;
        }

        // Simulate File Upload if other type
        let size = '0 MB';
        let fileUrl = '';
        if (uploadData.type !== 'Video' && uploadData.file) {
            size = `${(uploadData.file.size / (1024 * 1024)).toFixed(2)} MB`;
            fileUrl = URL.createObjectURL(uploadData.file); // client-side preview url
        }

        try {
            const payload = {
                action: 'upload',
                contentData: {
                    title: uploadData.title,
                    type: uploadData.type,
                    url: uploadData.type === 'Video' ? uploadData.url : fileUrl,
                    folderId: currentFolderId,
                    size: size,
                    courseIds: uploadData.selectedCourses, // Array of strings
                    description: 'Uploaded via Admin Panel'
                }
            };

            const res = await fetch('/api/admin/content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                toast.success("Resource uploaded successfully");
                setIsUploadOpen(false);
                setUploadData({ title: '', type: 'Video', url: '', selectedCourses: [], file: null });
                fetchContent();
            } else {
                toast.error("Failed to upload resource");
            }
        } catch (error) {
            toast.error("Error uploading resource");
        }
    };

    const handleRename = async () => {
        if (!selectedItem || !renameValue) return;
        const isFolder = selectedItem.type === 'Folder';
        const itemType = isFolder ? 'folder' : 'file';

        try {
            const res = await fetch('/api/admin/content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'rename',
                    id: selectedItem.id,
                    type: itemType,
                    newName: renameValue
                })
            });

            if (res.ok) {
                toast.success("Item renamed");
                setIsRenameOpen(false);
                if (viewItem && viewItem.id === selectedItem.id) {
                    setViewItem({ ...viewItem, title: renameValue, name: renameValue });
                }
                fetchContent();
            } else {
                toast.error("Failed to rename item");
            }
        } catch (error) {
            toast.error("Error renaming item");
        }
    };

    const handleDelete = async () => {
        if (!selectedItem) return;

        const isFolder = selectedItem.type === 'Folder';
        const itemType = isFolder ? 'folder' : 'file';

        try {
            const res = await fetch('/api/admin/content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'delete',
                    id: selectedItem.id,
                    type: itemType
                })
            });

            if (res.ok) {
                toast.success("Item deleted");
                setIsDeleteOpen(false);
                if (isDetailsOpen && viewItem?.id === selectedItem.id) {
                    setIsDetailsOpen(false);
                }
                fetchContent();
            } else {
                toast.error("Failed to delete item");
            }
        } catch (error) {
            toast.error("Error deleting item");
        }
    };

    const openDelete = (item: any) => {
        setSelectedItem(item);
        setIsDeleteOpen(true);
    };

    const openRename = (item: any) => {
        setSelectedItem(item);
        setRenameValue(item.title || item.name);
        setIsRenameOpen(true);
    };

    const openDetails = (item: any) => {
        setViewItem(item);
        setIsDetailsOpen(true);
    };

    // Navigation and Filtering
    const handleNavigate = (folderId: string) => {
        setCurrentFolderId(folderId);
    };

    const handleNavigateUp = (parentId: string | null) => {
        if (parentId) setCurrentFolderId(parentId);
        else setCurrentFolderId('root');
    };

    // Merged list for display
    const mergedContent = [
        ...(folderContents.folders || []).map(f => ({ ...f, type: 'Folder', size: '-', lastModified: f.createdAt.split('T')[0], status: 'Active' })),
        ...(folderContents.files || [])
    ];

    const filteredContent = mergedContent.filter(item =>
        (item.title || item.name || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    const toggleCourseSelection = (courseId: string) => {
        setUploadData(prev => {
            if (prev.selectedCourses.includes(courseId)) {
                return { ...prev, selectedCourses: prev.selectedCourses.filter(id => id !== courseId) };
            } else {
                return { ...prev, selectedCourses: [...prev.selectedCourses, courseId] };
            }
        });
    };

    const getCourseNames = (courseIds: string[] | undefined) => {
        if (!courseIds || courseIds.length === 0) return "None";
        return courseIds.map(id => courses.find(c => c.id === id)?.title || id).join(', ');
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'Folder': return <Folder className="h-6 w-6 text-yellow-500 fill-yellow-500" />;
            case 'Video': return <Video className="h-6 w-6 text-blue-500" />;
            case 'PDF': return <File className="h-6 w-6 text-red-500" />;
            case 'Image': return <FileImage className="h-6 w-6 text-purple-500" />;
            case 'Doc': return <FileText className="h-6 w-6 text-blue-400" />;
            default: return <File className="h-6 w-6 text-gray-400" />;
        }
    };

    return (
        <DashboardLayout role="admin" userName={admin.name} userEmail={admin.email}>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                            <FileText className="h-6 w-6 text-primary" />
                            Content Library
                        </h1>
                        <p className="text-muted-foreground">
                            Manage educational resources and assets
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Dialog open={isNewFolderOpen} onOpenChange={setIsNewFolderOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="gap-2">
                                    <Folder className="h-4 w-4" />
                                    New Folder
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Create New Folder</DialogTitle>
                                    <DialogDescription>Enter a name for the new folder.</DialogDescription>
                                </DialogHeader>
                                <div className="py-4">
                                    <Label htmlFor="folder-name">Folder Name</Label>
                                    <Input
                                        id="folder-name"
                                        value={folderName}
                                        onChange={(e) => setFolderName(e.target.value)}
                                        placeholder="e.g., Science Resources"
                                        className="mt-2"
                                    />
                                </div>
                                <DialogFooter>
                                    <Button onClick={handleCreateFolder}>Create Folder</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
                            <DialogTrigger asChild>
                                <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                                    <Upload className="h-4 w-4" />
                                    Upload Resource
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto w-[90vw]">
                                <DialogHeader>
                                    <DialogTitle>Upload Resource</DialogTitle>
                                    <DialogDescription>Select a file or video URL to upload to the library.</DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="file-title">Resource Title</Label>
                                        <Input
                                            id="file-title"
                                            value={uploadData.title}
                                            onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                                            placeholder="e.g., Chapter 1 Notes"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="file-type">Resource Type</Label>
                                        <Select
                                            value={uploadData.type}
                                            onValueChange={(val) => setUploadData({ ...uploadData, type: val })}
                                        >
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Video">Video URL</SelectItem>
                                                <SelectItem value="PDF">PDF Document</SelectItem>
                                                <SelectItem value="Image">Image</SelectItem>
                                                <SelectItem value="Doc">Word Document</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {uploadData.type === 'Video' ? (
                                        <div className="space-y-2">
                                            <Label htmlFor="video-url">Video URL</Label>
                                            <Input
                                                id="video-url"
                                                value={uploadData.url}
                                                onChange={(e) => setUploadData({ ...uploadData, url: e.target.value })}
                                                placeholder="https://youtube.com/..."
                                            />
                                        </div>
                                    ) : (
                                        <div className="space-y-2 border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center text-muted-foreground bg-muted/20">
                                            <Upload className="h-8 w-8 mb-2" />
                                            <Label htmlFor="file-upload" className="cursor-pointer">
                                                <span className="text-sm font-semibold text-primary">Click to upload</span> or drag and drop
                                            </Label>
                                            <Input
                                                id="file-upload"
                                                type="file"
                                                className="hidden"
                                                onChange={(e) => setUploadData({ ...uploadData, file: e.target.files ? e.target.files[0] : null })}
                                            />
                                            {uploadData.file && (
                                                <p className="mt-2 text-sm text-foreground font-medium">Selected: {uploadData.file.name}</p>
                                            )}
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <Label>Select Courses</Label>
                                        <Card className="h-40">
                                            <ScrollArea className="h-full p-2">
                                                {courses.map(course => (
                                                    <div key={course.id} className="flex items-center space-x-2 py-2 border-b last:border-0">
                                                        <Checkbox
                                                            id={course.id}
                                                            checked={uploadData.selectedCourses.includes(course.id)}
                                                            onCheckedChange={() => toggleCourseSelection(course.id)}
                                                        />
                                                        <Label htmlFor={course.id} className="text-sm font-normal cursor-pointer w-full pl-2">
                                                            {course.title}
                                                        </Label>
                                                    </div>
                                                ))}
                                            </ScrollArea>
                                        </Card>
                                        <p className="text-xs text-muted-foreground">Select courses where this content should be available.</p>
                                    </div>

                                </div>
                                <DialogFooter>
                                    <Button onClick={handleUpload}>Upload</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 p-2 rounded-md">
                    <button
                        onClick={() => handleNavigate('root')}
                        className={`hover:text-primary flex items-center gap-1 ${currentFolderId === 'root' ? 'font-semibold text-foreground' : ''}`}
                    >
                        <Home className="h-4 w-4" /> Home
                    </button>
                    {folderContents.breadcrumbs && folderContents.breadcrumbs.map((crumb, index) => (
                        <div key={crumb.id} className="flex items-center gap-2">
                            <ChevronRight className="h-4 w-4" />
                            <button
                                onClick={() => handleNavigate(crumb.id)}
                                className={`hover:text-primary ${crumb.id === currentFolderId ? 'font-semibold text-foreground' : ''}`}
                            >
                                {crumb.name}
                            </button>
                        </div>
                    ))}
                </div>

                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <CardTitle>Library Assets</CardTitle>
                            <div className="relative w-full sm:w-64">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search content..."
                                    className="pl-8"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>
                                            <div className='pl-2'>Name</div>
                                        </TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Size</TableHead>
                                        <TableHead>Last Modified</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoading ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-24 text-center">
                                                Loading...
                                            </TableCell>
                                        </TableRow>
                                    ) : filteredContent.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-24 text-center">
                                                No content found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredContent.map((item) => (
                                            <TableRow key={item.id}
                                                className="cursor-pointer hover:bg-muted/50"
                                                onClick={(e) => {
                                                    // Prevent navigation if clicking actions or within dropdown
                                                    if ((e.target as any).closest('.action-btn')) return;
                                                    // Navigate if folder, else open details
                                                    if (item.type === 'Folder') {
                                                        handleNavigate(item.id);
                                                    } else {
                                                        openDetails(item);
                                                    }
                                                }}
                                            >
                                                <TableCell className="font-medium">
                                                    <div className="flex items-center gap-2">
                                                        {item.type === 'Folder' ? (
                                                            <Folder className="h-5 w-5 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                                                        ) : item.type === 'Video' ? (
                                                            <Video className="h-5 w-5 text-blue-500 flex-shrink-0" />
                                                        ) : item.type === 'PDF' ? (
                                                            <File className="h-5 w-5 text-red-500 flex-shrink-0" />
                                                        ) : (
                                                            <FileText className="h-5 w-5 text-gray-500 flex-shrink-0" />
                                                        )}
                                                        <span className="truncate max-w-[200px] sm:max-w-[300px]" title={item.title || item.name}>
                                                            {item.title || item.name}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{item.type}</TableCell>
                                                <TableCell className="text-muted-foreground text-sm">{item.size || '-'}</TableCell>
                                                <TableCell className="text-muted-foreground text-sm">{item.lastModified ? item.lastModified : item.createdAt ? item.createdAt.split('T')[0] : '-'}</TableCell>
                                                <TableCell>
                                                    {item.status && (
                                                        <Badge variant={item.status === 'Published' ? 'default' : item.status === 'Draft' ? 'outline' : 'secondary'}>
                                                            {item.status}
                                                        </Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="h-8 w-8 p-0 action-btn">
                                                                <span className="sr-only">Open menu</span>
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                            <DropdownMenuItem onClick={() => openDetails(item)}>
                                                                <Info className="mr-2 h-4 w-4" /> View Details
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => openRename(item)}>
                                                                <Pencil className="mr-2 h-4 w-4" /> Rename
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => { }}>
                                                                <Share2 className="mr-2 h-4 w-4" /> Share Link
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem className="text-destructive" onClick={() => openDelete(item)}>
                                                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* File Details Sheet */}
            <Sheet open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <SheetContent className="overflow-y-auto sm:max-w-md">
                    <SheetHeader>
                        <SheetTitle>Content Details</SheetTitle>
                        <SheetDescription>View properties and sharing options.</SheetDescription>
                    </SheetHeader>
                    {viewItem && (
                        <div className="mt-6 space-y-6">
                            <div className="flex items-start gap-4 pb-4">
                                <div className="h-16 w-16 rounded-xl bg-muted/30 border flex items-center justify-center shadow-sm">
                                    {getTypeIcon(viewItem.type)}
                                </div>
                                <div className="overflow-hidden">
                                    <h3 className="font-bold text-xl line-clamp-2 leading-tight mb-1">{viewItem.title || viewItem.name}</h3>
                                    <Badge variant="secondary" className="text-xs">{viewItem.type}</Badge>
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <h4 className="text-sm font-semibold flex items-center gap-2">
                                    <Info className="h-4 w-4 text-primary" />
                                    Properties
                                </h4>
                                <div className="grid grid-cols-2 gap-4 text-sm bg-muted/20 p-4 rounded-lg border">
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground font-medium uppercase">Size</p>
                                        <p className="font-medium flex items-center gap-1.5">
                                            <HardDrive className="h-3.5 w-3.5 text-muted-foreground" />
                                            {viewItem.size || '-'}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground font-medium uppercase">Status</p>
                                        <Badge variant={viewItem.status === 'Published' ? 'default' : 'outline'} className="text-[10px] h-5">
                                            {viewItem.status || 'Active'}
                                        </Badge>
                                    </div>
                                    <div className="col-span-2 space-y-1">
                                        <p className="text-xs text-muted-foreground font-medium uppercase">Last Modified</p>
                                        <p className="font-medium flex items-center gap-1.5">
                                            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                                            {viewItem.lastModified ? viewItem.lastModified : viewItem.createdAt ? viewItem.createdAt.split('T')[0] : '-'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h4 className="text-sm font-semibold flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-primary" />
                                    Description
                                </h4>
                                <p className="text-sm text-muted-foreground leading-relaxed p-3 bg-muted/10 rounded-md border min-h-[60px]">
                                    {viewItem.description || 'No description provided for this resource.'}
                                </p>
                            </div>

                            {viewItem.type !== 'Folder' && (
                                <div className="space-y-2">
                                    <h4 className="text-sm font-semibold flex items-center gap-2">
                                        <Layers className="h-4 w-4 text-primary" />
                                        Linked Courses
                                    </h4>
                                    <div className="p-3 bg-muted/10 rounded-md border">
                                        <p className="text-sm leading-relaxed">{getCourseNames(viewItem.courseIds)}</p>
                                    </div>
                                </div>
                            )}

                            <Separator />

                            <div className="flex flex-col gap-2">
                                <Button className="w-full" onClick={() => toast.info("Downloading...")}>
                                    <Download className="mr-2 h-4 w-4" /> Download / View
                                </Button>
                                <div className="flex gap-2">
                                    <Button variant="outline" onClick={() => { setIsDetailsOpen(false); openRename(viewItem); }} className="flex-1">
                                        <Pencil className="mr-2 h-4 w-4" /> Rename
                                    </Button>
                                    <Button variant="destructive" onClick={() => { setIsDetailsOpen(false); openDelete(viewItem); }} className="flex-1">
                                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </SheetContent>
            </Sheet>

            {/* Rename Dialog */}
            <Dialog open={isRenameOpen} onOpenChange={setIsRenameOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Rename Item</DialogTitle>
                        <DialogDescription>Enter a new name for the item.</DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Label htmlFor="rename-input">New Name</Label>
                        <Input
                            id="rename-input"
                            value={renameValue}
                            onChange={(e) => setRenameValue(e.target.value)}
                            className="mt-2"
                        />
                    </div>
                    <DialogFooter>
                        <Button onClick={handleRename}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete this item?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently remove the file/folder from the library.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </DashboardLayout>
    );
}
