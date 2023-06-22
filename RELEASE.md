# How to Make a Release Process

**TL;DR**

- Use the `develop` branch to make changes.
- Create an `rc/*` branch from `develop` with the correct version based on the desired release.
- This triggers the GitHub action for pre-release, generating a release candidate of the SDK.
- Once everything is confirmed to be working fine, merge the `rc` branch into `main` and delete it afterwards.
- The GitHub action in the `main` branch will be triggered to release the new version of the SDK, generate and deploy the documentation to the GitHub page, and finally merge the `main` branch back into `develop`.

**Approach**

1. Development is done in the `develop` branch. Every change should be made in the `develop` branch. Always use conventional commits.

   Example commits:

   - `ci: update workflows`
   - `feat: update withdraw method`

2. Once the development is complete, create a new branch from `develop` called `rc/*`, where the asterisk denotes the semantic version number.

   Example: If the commits contain the word `feat`, it will be a minor release. If the commits include `fix`, it will be a patch release. If the footer of the commits includes `BREAKING CHANGE`, it will be a major release. Decide which number to use for the creation of the `rc` branch based on your commits.

3. After creating the `rc` branch, the GitHub action for pre-release is triggered. It tests and releases the pre-release version of the SDK in the format `2.0.0-rc.1`. If any issues are found in the `rc.1` version, you can make changes directly to the `rc` branch. This will trigger the GitHub action again and release the next `rc` version, such as `2.0.0-rc.2`, and so on.

4. Once everything is confirmed to be working fine with the release candidate, merge the `rc` branch into the `main` branch and delete the `rc` branch. This merge triggers another GitHub action to release the new version of the SDK, generate documentation, and deploy it to GitHub Pages. Finally, the `main` branch is automatically merged back into the `develop` branch.
