# Pynault Version Control and Releases

Git saves the history of your source code. Release versions identify
specific builds of Pynault. Commits record changes; tags mark releases.

## Current project status

The current application version is **0.3.0**.

The repository uses the `main` branch and already has a `v0.3.0` tag.
Check live status with `git status`; documentation changes may be uncommitted.
Run `git fetch origin --tags` to refresh remote status and release tags.

## Files to track

Commit:

- Application source and assets.
- Documentation and configuration.
- `package.json` and `package-lock.json`.
- Native Android source, configuration, and Gradle wrapper files.

Keep dependencies, generated bundles, local configuration, and signing
keys out of Git. Ensure `.gitignore` includes:

```gitignore
node_modules/
dist/
release/
android/.gradle/
android/build/
android/app/build/
android/local.properties
.env
.env.*
!.env.example
*.jks
*.keystore
```

Ignore rules do not remove files already tracked by Git. Never commit
signing passwords or private keys.

## Daily development workflow

Run these commands from the project root.

### 1. Create a branch

Start with a clean working tree:

```powershell
git switch main
git pull --ff-only origin main
git switch -c fix/mobile-navigation
```

Choose a branch name describing your change.

### 2. Edit and test

```powershell
git status
git diff
npm run verify
npm run build
```

Test the desktop or Android application when changing native behavior.

### 3. Commit changes

```powershell
git add .
git diff --cached
git commit -m "Fix mobile navigation"
```

Review staged changes before committing. You can stage individual files
instead of using `git add .`.

A commit saves changes locally; it does not upload them.

### 4. Push and merge

```powershell
git push -u origin fix/mobile-navigation
```

Open a pull request on GitHub from your branch into `main`. Review and
merge it, then update your local main branch:

```powershell
git switch main
git pull --ff-only origin main
```

## Release numbering

Use the format **MAJOR.MINOR.PATCH**:

| Version | Purpose |
| --- | --- |
| 0.3.1 | Fixes to the existing development release |
| 0.4.0 | New features during initial development |
| 1.0.0 | First stable, supported release |
| 1.0.1 | Fixes after the stable release |
| 1.1.0 | Compatible new features |
| 2.0.0 | Breaking changes after stability |

Before version 1.0.0, compatibility may change as the project develops.
Document breaking changes in release notes.

Use `0.3.0` in application configuration and `v0.3.0` for the Git tag.

## Mark the existing release

Inspect existing tags:

```powershell
git fetch origin --tags
git tag --list v0.3.0
git log -1 --oneline
```

If the tag does not exist and the current commit produced the verified
0.3.0 bundles:

```powershell
git tag -a v0.3.0 -m "Pynault 0.3.0 desktop and Android build"
git push origin v0.3.0
```

A tag identifies source code. It does not rebuild or upload the bundles.

If the bundles came from an earlier commit, tag that commit instead:

```powershell
git tag -a v0.3.0 COMMIT_HASH -m "Pynault 0.3.0"
git push origin v0.3.0
```

Replace `COMMIT_HASH` with the actual source commit. If its identity is
uncertain, rebuild from a known release commit before publishing.

Keep published tags unchanged. Use a new version for corrected releases.

## Prepare the next release

This example prepares version **0.3.1**.

### 1. Update the package version

On your development or release branch:

```powershell
npm version 0.3.1 --no-git-tag-version
```

This updates `package.json` and `package-lock.json` without creating a
commit or tag. Electron Builder uses this version for Windows packages.

### 2. Update the Android version

In `android/app/build.gradle`, set:

```groovy
versionCode 3
versionName "0.3.1"
```

The current 0.3.0 build uses `versionCode 2` and `versionName "0.3.0"`.

- `versionName` is the displayed application version.
- `versionCode` is an increasing integer used for Android updates.

Increase `versionCode` for each new Android release. Keep `versionName`
aligned with `package.json`.

Keep the application ID and signing key consistent across updates.
A release-signed APK generally cannot directly replace an installation
signed with a development key.

### 3. Verify and commit

Update release notes, then run:

```powershell
npm run verify
npm run build
git add .
git diff --cached
git commit -m "Prepare Pynault 0.3.1"
```

Push and merge these changes into `main`, then pull the merged branch.

### 4. Build and test

Build from the clean release commit:

```powershell
npm run desktop:dist
npm run mobile:apk
```

Android requires JDK 21 and a configured Android SDK.
See `docs/BUILD-BUNDLES.md` for setup details.

Expected outputs:

    release/Pynault Setup 0.3.1.exe
    release/Pynault 0.3.1.exe
    release/Pynault-0.3.1-android-debug.apk

The current Android command creates a development-signed debug APK.
Windows packages are unsigned unless a signing certificate is configured.

Test installation, launch, navigation, tabs, bookmarks, and downloads.
If fixes are needed, commit them and rebuild before tagging.

### 5. Tag the verified release

Confirm the current commit produced the tested bundles:

```powershell
git status
git log -1 --oneline
git tag -a v0.3.1 -m "Pynault 0.3.1"
git push origin v0.3.1
```

### 6. Publish on GitHub

Create a GitHub Release using the existing `v0.3.1` tag.

Include:

- Changes and fixes.
- Supported platforms.
- Signing status and known limitations.
- Installer EXE, portable EXE, and APK attachments.

Mark development releases as prereleases when appropriate. Upload
binaries as release attachments rather than committing them to Git.
Select files matching the version being published; `release/` may
contain older builds.

## Useful Git commands

| Command | Purpose |
| --- | --- |
| `git status` | Show branch and changed files |
| `git diff` | Inspect unstaged changes |
| `git diff --cached` | Inspect staged changes |
| `git log --oneline --decorate -10` | Show recent commits and tags |
| `git remote -v` | Show remote repository addresses |
| `git tag --list` | List release tags |
| `git show v0.3.0` | Inspect a tagged release |
| `git restore --staged FILE` | Unstage a file without discarding edits |
| `git revert COMMIT_HASH` | Create a commit reversing an earlier change |

Use `git revert` to undo published changes while preserving history.
Review and test the result. Avoid rewriting shared main-branch history
for routine corrections.

## Commit this document

```powershell
git add version.md
git commit -m "Document version control and release workflow"
git push
```

If working on a branch, merge through a pull request.