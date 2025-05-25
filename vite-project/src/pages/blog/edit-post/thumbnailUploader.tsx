"use client"
import { useCallback, useState, useRef, forwardRef, useImperativeHandle, useEffect } from "react"
import type React from "react"

import { Upload, Crop, Check, Trash, ArrowRight } from "lucide-react"
import { useDropzone } from "react-dropzone"
import ReactCrop, { type Crop as CropArea, centerCrop, makeAspectCrop } from "react-image-crop"
import "react-image-crop/dist/ReactCrop.css"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

// Mô phỏng API upload
const simulateUpload = async (file: File): Promise<{ url: string; success: boolean }> => {
    return new Promise((resolve) => {
        // Tạo URL cho file để xem trước
        const url = URL.createObjectURL(file)

        // Mô phỏng thời gian upload
        setTimeout(() => {
            resolve({ url, success: true })
        }, 0)
    })
}

// Hàm tạo crop mặc định với tỷ lệ khung hình
function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number) {
    return centerCrop(
        makeAspectCrop(
            {
                unit: "%",
                width: 90,
            },
            aspect,
            mediaWidth,
            mediaHeight,
        ),
        mediaWidth,
        mediaHeight,
    )
}
export type ThumbnailUploaderRef = {
    getThumbnail: () => ThumbnailData
    reset: () => void
}
// Định nghĩa kiểu dữ liệu cho thumbnail
export type ThumbnailData = {
    url: string | null
    file: File | null
    blob: Blob | null
}
// Định nghĩa props
interface ThumbnailUploaderProps {
    disabled?: boolean
    onImageChange?: (thumbnailData: ThumbnailData) => void
    defaultImage?: string
    onUploadThumbnail?: (thumbnailData: ThumbnailData) => Promise<void>
}
export const ThumbnailUploader = forwardRef<ThumbnailUploaderRef, ThumbnailUploaderProps>(
    ({ onImageChange, defaultImage, onUploadThumbnail, disabled }, ref) => {
        const [thumbnail, setThumbnail] = useState<string | null>(null)
        const [isUploading, setIsUploading] = useState(false)
        const [uploadProgress, setUploadProgress] = useState(0)
        const [error, setError] = useState<string | null>(null)
        const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
        const [thumbnailBlob, setThumbnailBlob] = useState<Blob | null>(null)
        const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)

        // State cho tính năng crop
        const [crop, setCrop] = useState<CropArea>()
        const [completedCrop, setCompletedCrop] = useState<CropArea>()
        const imgRef = useRef<HTMLImageElement>(null)
        const previewCanvasRef = useRef<HTMLCanvasElement>(null)
        const [scale, setScale] = useState(1)
        const [originalImage, setOriginalImage] = useState<string | null>(null)

        // Nếu có hình ảnh mặc định, đặt nó làm thumbnail
        useEffect(() => {
            if (defaultImage) {
                fetchImageAsFile(defaultImage, "default-image.jpg").then((file) => {
                    if (thumbnail && thumbnail !== originalImage) {
                        URL.revokeObjectURL(thumbnail)
                    }
                    const objectUrl = URL.createObjectURL(file);
                    setThumbnail(objectUrl)
                    setOriginalImage(objectUrl)
                    setThumbnailFile(file)
                    imgRef.current!.src = objectUrl
                })


            }
        }, [defaultImage])

        // Hàm để lấy thumbnail hiện tại
        const getThumbnail = useCallback((): ThumbnailData => {
            return {
                url: thumbnail,
                file: thumbnailFile,
                blob: thumbnailBlob,
            }
        }, [thumbnail, thumbnailFile, thumbnailBlob])

        // Hàm để reset thumbnail
        const reset = useCallback(() => {
            if (thumbnail) {
                URL.revokeObjectURL(thumbnail)
            }
            if (originalImage) {
                URL.revokeObjectURL(originalImage)
            }
            setThumbnail(null)
            setOriginalImage(null)
            setThumbnailBlob(null)
            setThumbnailFile(null)
        }, [thumbnail, originalImage])
        useImperativeHandle(
            ref,
            () => ({
                getThumbnail,
                reset,
            }),
            [getThumbnail, reset],
        )
        // Aspect ratio cho crop (16:9)
        const aspect = 16 / 9

        const onDrop = useCallback(async (acceptedFiles: File[]) => {
            const file = acceptedFiles[0]

            if (!file) return

            // Kiểm tra loại file
            if (!file.type.startsWith("image/")) {
                setError("Chỉ chấp nhận file hình ảnh")
                return
            }

            // Kiểm tra kích thước file (tối đa 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setError("Kích thước file không được vượt quá 5MB")
                return
            }

            try {
                setIsUploading(true)
                setError(null)

                // Mô phỏng tiến trình upload
                const interval = setInterval(() => {
                    setUploadProgress((prev) => {
                        if (prev >= 95) {
                            clearInterval(interval)
                            return prev
                        }
                        return prev + 5
                    })
                }, 100)

                // Mô phỏng API upload
                const url = URL.createObjectURL(file)

                clearInterval(interval)
                setUploadProgress(100)

                setThumbnail(url)
                setOriginalImage(url)
                setThumbnailFile(file)
                setTimeout(() => {
                    setIsUploading(false)
                    setUploadProgress(0)
                }, 500)
                setUploadProgress(100)
                // Chuyển đổi file thành blob - FIX: Thêm dòng này để đọc file
                const reader = new FileReader()
                reader.onload = (e) => {
                    if (e.target?.result) {
                        const blob = new Blob([e.target.result as ArrayBuffer], { type: file.type })
                        setThumbnailBlob(blob)
                    }
                }
                reader.readAsArrayBuffer(file) // FIX: Thêm dòng này để đọc file

            } catch (err) {
                setError(err instanceof Error ? err.message : "Có lỗi xảy ra khi tải lên hình ảnh")
                setIsUploading(false)
                setUploadProgress(0)
            }
        }, [])

        const { getRootProps, getInputProps, isDragActive } = useDropzone({
            onDrop,
            accept: {
                "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
            },
            maxFiles: 1,
            disabled: isUploading,
        })

        const handleRemoveThumbnail = () => {
            reset() // FIX: Sử dụng hàm reset đã định nghĩa
        }

        // Xử lý khi hình ảnh được tải
        const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
            const { width, height } = e.currentTarget

            // Tạo crop mặc định với tỷ lệ 16:9
            const newCrop = centerAspectCrop(width, height, aspect)
            setCrop(newCrop)
            setCompletedCrop(newCrop)

            // FIX: Xóa dòng setThumbnailBlob() không có tham số
        }

        // Áp dụng crop vào hình ảnh
        const handleApplyCrop = () => {
            if (!completedCrop || !imgRef.current || !previewCanvasRef.current) {
                return
            }

            const image = imgRef.current
            const canvas = previewCanvasRef.current
            const ctx = canvas.getContext("2d")

            if (!ctx) {
                return
            }

            // Thiết lập kích thước canvas
            const scaleX = image.naturalWidth / image.width
            const scaleY = image.naturalHeight / image.height

            canvas.width = completedCrop.width * scaleX
            canvas.height = completedCrop.height * scaleY

            // Vẽ phần được cắt lên canvas
            ctx.drawImage(
                image,
                completedCrop.x * scaleX,
                completedCrop.y * scaleY,
                completedCrop.width * scaleX,
                completedCrop.height * scaleY,
                0,
                0,
                completedCrop.width * scaleX,
                completedCrop.height * scaleY,
            )

            // Chuyển đổi canvas thành URL hình ảnh và blob
            canvas.toBlob(
                (blob) => {
                    if (!blob) {
                        return
                    }

                    // Xóa URL cũ nếu có
                    if (thumbnail && thumbnail !== originalImage) {
                        URL.revokeObjectURL(thumbnail)
                    }

                    // Tạo URL mới cho hình ảnh đã cắt
                    const croppedImageUrl = URL.createObjectURL(blob)
                    setThumbnail(croppedImageUrl)

                    // FIX: Cập nhật blob và file
                    setThumbnailBlob(blob)

                    // Tạo File object từ Blob
                    if (thumbnailFile) {
                        const fileName = thumbnailFile.name
                        const fileType = thumbnailFile.type
                        const croppedFile = new File([blob], fileName, {
                            type: fileType,
                            lastModified: new Date().getTime(),
                        })
                        setThumbnailFile(croppedFile)
                    }

                    setIsEditDialogOpen(false)

                    // FIX: Gọi callback nếu có
                    if (onImageChange) {
                        const thumbnailData = {
                            url: croppedImageUrl,
                            file: thumbnailFile,
                            blob: blob,
                        }
                        onImageChange(thumbnailData)
                    }
                },
                "image/jpeg",
                0.95,
            ) // FIX: Thêm chất lượng JPEG
        }

        // Mở dialog chỉnh sửa
        const handleOpenEditDialog = () => {
            // Đặt lại crop khi mở dialog
            setCrop(undefined)
            setIsEditDialogOpen(true)
        }

        return (
            <>
                <div className="space-y-4 w-full">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full items-center">
                        {/* Khu vực tải lên - bên trái */}
                        <div
                            {...getRootProps()}
                            className={cn(
                                "border-2 border-dashed rounded-lg p-6 transition-colors flex flex-col items-center justify-center cursor-pointer h-full",
                                isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50",
                            )}
                        >
                            <input disabled={disabled} {...getInputProps()} id="thumbnail" />
                            <div
                                className={cn(
                                    "flex flex-col items-center justify-center space-y-4 text-center",
                                    disabled && "opacity-50 cursor-not-allowed select-none" // hiệu ứng khi disabled
                                )}
                            >
                                <div className={cn("rounded-full p-4", disabled ? "bg-gray-200" : "bg-primary/10")}>
                                    <Upload className={cn("h-8 w-8", disabled ? "text-gray-400" : "text-primary")} />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">
                                        {isDragActive ? "Drop here" : "Drop or click to preview image"}
                                    </p>
                                    <p className="text-xs text-muted-foreground">Support JPG, PNG, GIF (max 5MB)</p>
                                </div>
                            </div>
                        </div>

                        {/* Hiển thị thumbnail - bên phải */}
                        <div className="flex flex-col items-center justify-center">
                            {!thumbnail ? (
                                <div className="flex flex-col items-center justify-center h-full min-h-[200px] border-2 border-dashed rounded-lg p-6 border-muted-foreground/10 bg-muted/5">
                                    <div className="flex flex-col items-center justify-center space-y-2 text-center text-muted-foreground">
                                        <ArrowRight className="h-8 w-8" />
                                        <p>Thumbnail will display here</p>
                                    </div>
                                </div>
                            ) : (
                                <Card className="overflow-hidden w-full">
                                    <CardContent className="p-4">
                                        <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                                            <img
                                                src={thumbnail || "/placeholder.svg"}
                                                alt="Thumbnail preview"
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                        <div>
                            <div className="flex flex-col items-center space-y-2">
                                <Button

                                    type="button"
                                    className="w-full"
                                    variant="outline"
                                    onClick={handleOpenEditDialog}
                                    disabled={!thumbnail || disabled || isUploading}
                                >
                                    <Crop className="h-4 w-4 mr-2" />
                                    Crop image
                                </Button>
                                <Button


                                    type="button"
                                    
                                    className="w-full"
                                    variant="outline"
                                    onClick={handleRemoveThumbnail}
                                    disabled={!thumbnail || disabled || isUploading}
                                >
                                    <Trash className="h-4 w-4 mr-2" />
                                    Delete image
                                </Button>
                                <Button type="button" disabled={disabled || isUploading} onClick={async () => {
                                    setIsUploading(true)
                                    setUploadProgress(0)

                                    const interval = setInterval(() => {
                                        setUploadProgress((prev) => {
                                            if (prev >= 95) {
                                                clearInterval(interval)
                                                return prev
                                            }
                                            return prev + 3
                                        })
                                    }, 100)

                                    // Mô phỏng API upload
                                    await onUploadThumbnail?.(getThumbnail())

                                    clearInterval(interval)
                                    setUploadProgress(100)


                                    setTimeout(() => {
                                        setIsUploading(false)
                                        setUploadProgress(0)
                                    }, 500)
                                }} className="w-full">
                                    <Upload className="h-4 w-4 mr-2" />
                                    Save image
                                </Button>

                                {isUploading && (
                                    <div className="space-y-2 w-full">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium">Loading...</p>
                                            <p className="text-sm text-muted-foreground">{uploadProgress}%</p>
                                        </div>
                                        <Progress value={uploadProgress} className="h-2" />
                                    </div>
                                )}

                                {error && (
                                    <div className="rounded-lg bg-destructive/10 p-4 text-destructive">
                                        <p className="text-sm font-medium">{error}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Dialog cắt hình ảnh */}
                    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                        <DialogContent className="sm:max-w-lg">
                            <DialogHeader>
                                <DialogTitle>Crop the thumbnail image</DialogTitle>
                                <DialogDescription>
                                    Adjust the crop area by dragging the corners or edges of the rectangle. You can also use the mouse wheel to zoom in and out.

                                </DialogDescription>
                            </DialogHeader>

                            {originalImage && (
                                <div className="flex flex-col items-center space-y-4">
                                    <div className="w-full overflow-hidden rounded-lg border">
                                        <ReactCrop
                                            crop={crop}
                                            onChange={(c) => setCrop(c)}
                                            onComplete={(c) => setCompletedCrop(c)}
                                            aspect={aspect}
                                            className="max-h-[400px] w-full"

                                        >
                                            <img
                                                ref={imgRef}
                                                src={originalImage || "/placeholder.svg"}
                                                alt="Original image for cropping"
                                                onLoad={onImageLoad}
                                                style={{ transform: `scale(${scale})` }}
                                            />
                                        </ReactCrop>
                                    </div>


                                    {/* Canvas ẩn để xử lý hình ảnh đã cắt */}
                                    <canvas ref={previewCanvasRef} style={{ display: "none" }} />
                                </div>
                            )}

                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleApplyCrop}>
                                    <Check className="h-4 w-4 mr-2" />
                                    Apply
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </>
        )
    },
)

async function fetchImageAsFile(url: string, filename: string): Promise<File> {
    const response = await fetch(url, { mode: 'cors' });
    if (!response.ok) throw new Error('Failed to fetch image');

    const blob = await response.blob();
    // Tạo File từ Blob
    return new File([blob], filename, { type: blob.type });
}