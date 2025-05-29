package com.vinsuite.service.dev;

import org.eclipse.jgit.api.CloneCommand;
import org.eclipse.jgit.api.Git;
import org.eclipse.jgit.api.errors.GitAPIException;
import org.springframework.stereotype.Service;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Instant;

/**
 * Service to clone public Git repositories to local temporary storage.
 */
@Service
public class GitCloneService {

    private static final String BASE_CLONE_DIR = System.getProperty("java.io.tmpdir") + "/vinsuite-repos";

    /**
     * Clones a public Git repository to a unique folder.
     *
     * @param repoUrl GitHub or GitLab repo URL (e.g. https://github.com/user/repo.git)
     * @param branch  Optional branch to clone (defaults to 'main')
     * @return Success message with local path
     * @throws Exception on failure to clone
     */
    public String cloneRepository(String repoUrl, String branch) throws Exception {
        String timestamp = Instant.now().toEpochMilli() + "";
        Path targetDir = Path.of(BASE_CLONE_DIR, "repo-" + timestamp);
        Files.createDirectories(targetDir);

        try {
            CloneCommand clone = Git.cloneRepository()
                    .setURI(repoUrl)
                    .setDirectory(targetDir.toFile())
                    .setBranch(branch)
                    .setCloneAllBranches(false);

            try (Git git = clone.call()) {
                return "Repository cloned successfully to: " + targetDir;
            }
        } catch (GitAPIException e) {
            throw new Exception("Failed to clone repo: " + e.getMessage(), e);
        }
    }
}
