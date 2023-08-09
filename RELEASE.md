# Release

1. Everything is done in the **sdk-1.0** branch.

2. Create a pull request (PR) to the **sdk-1.0** branch.

3. **ALWAYS** use [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) like the following examples:

   - `feat`: Allow provided config object to extend other configs.
   - `fix`: Update method.

4. Once it's merged into **sdk-1.0**, create a release branch from **sdk-1.0**. Based on your commits:

   - If it's a fix, create a patch release.
   - If it's a feat commit, create a minor release.

   Examples:

   - If your commits are:
     ```
     feat: allow provided config object to extend other configs
     fix: update method
     ```
     You'll need to create a minor release because it contains a feat commit. The latest release is 1.21.9, so create a branch **release/v1.22.0**. This will automatically trigger the GitHub action to release version 1.22.0 of SDK version 1.

5. After completing step 4, merge **release/v1.22.0** back into the **sdk-1.0** branch to ensure everything is integrated into the **sdk-1.0** branch.
