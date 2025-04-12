package com.noface.newswebapi.controller;

import com.noface.newswebapi.dto.response.ApiResponse;
import com.noface.newswebapi.service.FileUploadService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;


@RestController
@RequestMapping("/api/images")
@Slf4j
public class ImageUploadController {
    @Autowired
    private FileUploadService fileUploadService;
    @PostMapping("/thumbnails/{artileId}")
    public ApiResponse<Map> uploadImageThumbnails(
            @RequestParam("file") MultipartFile file,
            @RequestParam(defaultValue = "draft") String folder,
            @RequestParam(required = false) String name,
            @RequestParam(defaultValue = "false") boolean overwrite,
            @PathVariable("artileId") Long articleId
    ) throws IOException {
        log.info("Successfully uploaded image");
        return ApiResponse.<Map>builder()
                .result(fileUploadService.uploadImage(file, folder, name, overwrite))
                .build();
    }

}
