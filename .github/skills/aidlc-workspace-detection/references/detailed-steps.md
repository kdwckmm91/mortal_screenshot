
# Workspace Detection

**Purpose**: Determine workspace state and check for existing AI-DLC projects

## Step 1: Check for Existing AI-DLC Project

Check if `aidlc-docs/aidlc-state.md` exists:
- **If exists**: Resume from last phase (load context from previous phases)
- **If not exists**: Continue with new project assessment

## Step 2: Scan Workspace for Existing Code

**Determine if workspace has existing code:**
- Scan workspace for source code files (.java, .py, .js, .ts, etc.)
- Check for build files (pom.xml, package.json, build.gradle, etc.)
- Look for project structure indicators

**Record findings:**
```markdown
## Workspace State
- **Existing Code**: [Yes/No]
- **Programming Languages**: [List if found]
- **Build System**: [Maven/Gradle/npm/etc. if found]
- **Project Structure**: [Monolith/Microservices/Library/Empty]
```

## Step 3: Determine Next Phase

**Web UI Detection**: Analyze user request for Web UI indicators:
- Frontend frameworks: React, Vue, Angular, Svelte, Next.js, etc.
- UI-related keywords: 画面, ダッシュボード, ログイン, フォーム, UI, フロントエンド, Web画面, etc.
- Web application types: SPA, Webアプリ, etc.

**IF workspace is empty (no existing code)**:
- Set flag: `brownfield = false`
- **IF Web UI detected in user request**:
  - Set flag: `webUI = true`
  - Next phase: UI Mockup
- **ELSE**:
  - Set flag: `webUI = false`
  - Next phase: Requirements Analysis

**IF workspace has existing code**:
- Set flag: `brownfield = true`
- Check for existing reverse engineering artifacts in `aidlc-docs/inception/reverse-engineering/`
- **IF reverse engineering artifacts exist**:
  - Load them
  - **IF Web UI detected**:
    - Next phase: UI Mockup
  - **ELSE**:
    - Next phase: Requirements Analysis
- **IF no reverse engineering artifacts**:
  - Next phase: Reverse Engineering (RE完了後にUI Mockup判定)

## Step 4: Create Initial State File

Create `aidlc-docs/aidlc-state.md`:

```markdown
# AI-DLC State Tracking

## Project Information
- **Project Type**: [Greenfield/Brownfield]
- **Start Date**: [ISO timestamp]
- **Current Stage**: INCEPTION - Workspace Detection

## Workspace State
- **Existing Code**: [Yes/No]
- **Reverse Engineering Needed**: [Yes/No]

## Stage Progress
[Will be populated as workflow progresses]
```

## Step 5: Present Completion Message

**For Brownfield Projects:**
```markdown
# 🔍 Workspace Detection Complete

Workspace analysis findings:
• **Project Type**: Brownfield project
• [AI-generated summary of workspace findings in bullet points]
• **Next Step**: Proceeding to **Reverse Engineering** to analyze existing codebase...
```

**For Greenfield Projects with Web UI:**
```markdown
# 🔍 Workspace Detection Complete

Workspace analysis findings:
• **Project Type**: Greenfield project
• **Web UI Detected**: Yes
• **Next Step**: Proceeding to **UI Mockup** to create visual prototypes...
```

**For Greenfield Projects without Web UI:**
```markdown
# 🔍 Workspace Detection Complete

Workspace analysis findings:
• **Project Type**: Greenfield project
• **Next Step**: Proceeding to **Requirements Analysis**...
```

## Step 6: Automatically Proceed

- **No user approval required** - this is informational only
- Automatically proceed to next phase:
  - **Brownfield (no RE artifacts)**: Reverse Engineering
  - **Brownfield (RE artifacts exist) + Web UI**: UI Mockup
  - **Brownfield (RE artifacts exist) + No Web UI**: Requirements Analysis
  - **Greenfield + Web UI**: UI Mockup
  - **Greenfield + No Web UI**: Requirements Analysis
