package com.vinsuite.service.dev;

import org.springframework.stereotype.Service;

import java.io.File;
import java.util.*;

@Service
public class GitRepoExplorerService {

    /**
     * Lists all files and directories inside a given root repo path.
     *
     * @param rootPath root repo directory
     * @return list of maps containing file details (name + relative path)
     */
    public List<Map<String, String>> listRepoFiles(String rootPath) {
        File root = new File(rootPath);
        if (!root.exists() || !root.isDirectory()) {
            throw new IllegalArgumentException("Invalid root directory: " + rootPath);
        }

        List<Map<String, String>> fileList = new ArrayList<>();
        walkFiles(root, root, fileList);
        return fileList;
    }

    private void walkFiles(File root, File current, List<Map<String, String>> list) {
        for (File file : Objects.requireNonNull(current.listFiles())) {
            if (file.isDirectory()) {
                walkFiles(root, file, list);
            } else {
                String relativePath = root.toPath().relativize(file.toPath()).toString();
                list.add(Map.of(
                        "name", file.getName(),
                        "path", relativePath.replace("\\", "/")));
            }
        }
    }

    public String readFileContent(String filePath) throws Exception {
        File file = new File(filePath);
        if (!file.exists() || !file.isFile()) {
            throw new IllegalArgumentException("Invalid file path: " + filePath);
        }

        return java.nio.file.Files.readString(file.toPath());
    }

}
