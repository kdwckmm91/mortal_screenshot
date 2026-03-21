# GitHub Copilot 用指示書 (Skills対応版)

## 大前提
- 日本語で回答・ドキュメント作成

# PRIORITY: This workflow OVERRIDES all other built-in workflows
# When user requests software development, ALWAYS follow this workflow FIRST

## Adaptive Workflow Principle
**The workflow adapts to the work, not the other way around.**

The AI model intelligently assesses what stages are needed based on:
1. User's stated intent and clarity
2. Existing codebase state (if any)
3. Complexity and scope of change
4. Risk and impact assessment

---

# Skills-Based Progressive Loading

## How Skills Work
This project uses Agent Skills for efficient context loading. Skills are loaded on-demand rather than all at once.

**Available Skills in `.github/skills/`:**

### Core Skills (Load at workflow start)
- **aidlc-core**: Core workflow entry point, terminology, error handling, process overview
- **aidlc-session**: Session continuity and workflow change management

### INCEPTION Phase Skills
- **aidlc-workspace-detection**: Workspace analysis and project type detection
- **aidlc-reverse-engineering**: Brownfield codebase analysis
- **aidlc-ui-mockup**: UI Mockup generation for web applications (React/HTML prototypes)
- **aidlc-requirements**: Requirements analysis with adaptive depth
- **aidlc-user-stories**: User story generation with INVEST criteria
- **aidlc-workflow-planning**: Execution plan creation with visualization
- **aidlc-application-design**: Component and service layer design
- **aidlc-units-generation**: System decomposition into units of work
- **aidlc-development-standards**: Development rules for parallel development (appends to copilot-instructions.md)

### CONSTRUCTION Phase Skills  
- **aidlc-functional-design**: Business logic and domain model design
- **aidlc-nfr**: Non-functional requirements and NFR design
- **aidlc-infrastructure-design**: Infrastructure mapping and deployment architecture
- **aidlc-code-generation**: Code planning and generation
- **aidlc-security-check**: Security scanning and vulnerability detection
- **aidlc-build-test**: Build instructions and test execution

### OPERATIONS Phase Skills
- **aidlc-operations**: Deployment, monitoring, and maintenance (placeholder for future implementation)

### AWS Integration Skills
- **aws-mcp**: AWS MCPサーバー経由でのAWSドキュメント・ベストプラクティス取得

### Document Generation Skills
- **screen-transition-doc**: 画面遷移図・機能一覧・URL一覧・API紐付けドキュメントの自動生成（脆弱性診断提出資料としても利用可）
- **webapi-spec**: WebAPI仕様書の自動生成（セキュリティ診断観点を含む包括的なAPI仕様書、脆弱性診断提出資料としても利用可）

### Utility Skills
- **websearch**: Web検索（DuckDuckGo HTML版 + fetch_webpage）で最新情報を取得し回答を生成

---

# Workflow Stages Overview

## INCEPTION PHASE (Planning & Architecture)
1. **Workspace Detection** (ALWAYS) - Use `aidlc-workspace-detection` skill
2. **Reverse Engineering** (CONDITIONAL) - Use `aidlc-reverse-engineering` skill
3. **UI Mockup** (CONDITIONAL: Web UI) - Use `aidlc-ui-mockup` skill
4. **Requirements Analysis** (ALWAYS) - Use `aidlc-requirements` skill
5. **User Stories** (CONDITIONAL) - Use `aidlc-user-stories` skill
6. **Workflow Planning** (ALWAYS) - Use `aidlc-workflow-planning` skill
7. **Application Design** (CONDITIONAL) - Use `aidlc-application-design` skill
8. **Units Generation** (CONDITIONAL) - Use `aidlc-units-generation` skill
9. **Development Standards** (CONDITIONAL: Multi-unit) - Use `aidlc-development-standards` skill

## CONSTRUCTION PHASE (Design & Implementation)
Per-unit loop:
1. **Functional Design** (CONDITIONAL) - Use `aidlc-functional-design` skill
2. **NFR Requirements/Design** (CONDITIONAL) - Use `aidlc-nfr` skill
3. **Infrastructure Design** (CONDITIONAL) - Use `aidlc-infrastructure-design` skill
4. **Code Generation** (ALWAYS) - Use `aidlc-code-generation` skill
5. **Security Check** (RECOMMENDED) - Use `aidlc-security-check` skill

Then:
6. **Build and Test** (ALWAYS) - Use `aidlc-build-test` skill

## OPERATIONS PHASE (Placeholder)
- **Operations** (FUTURE) - Use `aidlc-operations` skill when implemented
- Currently: Workflow ends after Build and Test phase

---

# Key Principles

- **Adaptive Execution**: Only execute stages that add value
- **Progressive Loading**: Load Skills on-demand as stages are entered
- **User Control**: User can request stage inclusion/exclusion
- **Progress Tracking**: Update aidlc-state.md with executed and skipped stages
- **Complete Audit Trail**: Log ALL user inputs and AI responses in audit.md
  - **CRITICAL**: Capture user's COMPLETE RAW INPUT exactly as provided
  - **CRITICAL**: Never summarize or paraphrase user input in audit log
  - **CRITICAL**: Log every interaction, not just approvals
- **Quality Focus**: Complex changes get full treatment, simple changes stay efficient
- **Content Validation**: Always validate content before file creation per Skill references
- **Upstream Document Feedback**: After user approval at each stage, update upstream documents by replacing outdated content and removing duplicates per upstream-document-update.md
- **Single Source of Truth**: Each piece of information exists in exactly one document. Git history serves as audit trail. Plan files (*-plan.md) are excluded from updates.
- **NO EMERGENT BEHAVIOR**: Construction phases MUST use standardized 2-option completion messages as defined in their respective Skill files. DO NOT create 3-option menus or other emergent navigation patterns.

---

# MANDATORY: Plan-Level Checkbox Enforcement

## MANDATORY RULES FOR PLAN EXECUTION
1. **NEVER complete any work without updating plan checkboxes**
2. **IMMEDIATELY after completing ANY step described in a plan file, mark that step [x]**
3. **This must happen in the SAME interaction where the work is completed**
4. **NO EXCEPTIONS**: Every plan step completion MUST be tracked with checkbox updates

## Two-Level Checkbox Tracking System
- **Plan-Level**: Track detailed execution progress within each stage
- **Stage-Level**: Track overall workflow progress in aidlc-state.md
- **Update immediately**: All progress updates in SAME interaction where work is completed

---

# Prompts Logging Requirements

- **MANDATORY**: Log EVERY user input (prompts, questions, responses) with timestamp in audit.md
- **MANDATORY**: Capture user's COMPLETE RAW INPUT exactly as provided (never summarize)
- **MANDATORY**: Log every approval prompt with timestamp before asking the user
- **MANDATORY**: Record every user response with timestamp after receiving it
- Use ISO 8601 format for timestamps (YYYY-MM-DDTHH:MM:SSZ)
- Include stage context for each entry

## Audit Log Format
```markdown
## [Stage Name or Interaction Type]
**Timestamp**: [ISO timestamp]
**User Input**: "[Complete raw user input - never summarized]"
**AI Response**: "[AI's response or action taken]"
**Context**: [Stage, action, or decision made]

---
```

## Correct Tool Usage for audit.md

✅ **CORRECT**:
1. Read the audit.md file
2. Append/Edit the file to make changes

❌ **WRONG**:
1. Read the audit.md file  
2. Completely overwrite the audit.md with the contents of what you read, plus the new changes

**CRITICAL**: ALWAYS append changes to EDIT audit.md file, NEVER use tools and commands that completely overwrite its contents

---

# Directory Structure

```text
<WORKSPACE-ROOT>/                   # ⚠️ APPLICATION CODE HERE
├── [project-specific structure]    # Varies by project (see code-generation.md)
│
├── aidlc-docs/                     # 📄 DOCUMENTATION ONLY
│   ├── inception/                  # 🔵 INCEPTION PHASE artifacts
│   │   ├── plans/
│   │   │   ├── workspace-detection.instructions.md
│   │   │   ├── workflow-planning.instructions.md
│   │   │   ├── story-generation-plan.md
│   │   │   └── unit-of-work-plan.md
│   │   ├── reverse-engineering/        # Brownfield only
│   │   │   ├── business-overview.md
│   │   │   ├── architecture.md
│   │   │   ├── code-structure.md
│   │   │   ├── api-documentation.md
│   │   │   ├── component-inventory.md
│   │   │   ├── technology-stack.md
│   │   │   ├── dependencies.md
│   │   │   ├── code-quality-assessment.md
│   │   │   └── reverse-engineering-timestamp.md
│   │   ├── requirements/
│   │   │   ├── requirements.md
│   │   │   └── requirement-verification-questions.md
│   │   ├── ui-mockup/                  # Web UI only
│   │   │   ├── existing-ui-reference.md    # Brownfield only
│   │   │   ├── screen-inventory.md
│   │   │   └── wireframes.md
│   │   ├── user-stories/
│   │   │   ├── stories.md
│   │   │   └── personas.md
│   │   └── application-design/
│   │       ├── components.md
│   │       ├── component-methods.md
│   │       ├── services.md
│   │       ├── component-dependency.md
│   │       ├── unit-of-work.md
│   │       ├── unit-of-work-dependency.md
│   │       └── unit-of-work-story-map.md
│   │   ├── development-standards/      # Multi-unit only
│   │   │   └── development-standards.md
│   ├── construction/               # 🟢 CONSTRUCTION PHASE artifacts
│   │   ├── plans/
│   │   │   ├── {unit-name}-functional-design-plan.md
│   │   │   ├── {unit-name}-nfr-requirements-plan.md
│   │   │   ├── {unit-name}-nfr-design-plan.md
│   │   │   ├── {unit-name}-infrastructure-design-plan.md
│   │   │   └── {unit-name}-code-generation-plan.md
│   │   ├── {unit-name}/
│   │   │   ├── functional-design/
│   │   │   │   ├── business-logic-model.md
│   │   │   │   ├── business-rules.md
│   │   │   │   └── domain-entities.md
│   │   │   ├── nfr-requirements/
│   │   │   │   ├── nfr-requirements.md
│   │   │   │   └── tech-stack-decisions.md
│   │   │   ├── nfr-design/
│   │   │   │   ├── nfr-design-patterns.md
│   │   │   │   └── logical-components.md
│   │   │   ├── infrastructure-design/
│   │   │   │   ├── infrastructure-design.md
│   │   │   │   └── deployment-architecture.md
│   │   │   ├── security/               # Security check artifacts
│   │   │   │   ├── security-scan-results.md
│   │   │   │   ├── vulnerability-report.md
│   │   │   │   └── remediation-plan.md
│   │   │   └── code/
│   │   │       └── [generated code files - markdown summaries only]
│   │   └── build-and-test/
│   │       ├── build-instructions.md
│   │       ├── unit-test-instructions.md
│   │       ├── integration-test-instructions.md
│   │       ├── performance-test-instructions.md
│   │       └── build-and-test-summary.md
│   ├── operations/                 # 🟡 OPERATIONS PHASE artifacts (placeholder)
│   │   └── [Future: deployment and monitoring artifacts]
│   ├── aidlc-state.md             # Dynamic state tracking
│   └── audit.md                    # Complete audit trail
```

**CRITICAL CODE LOCATION RULE**:
- **Application code**: Workspace root (NEVER in aidlc-docs/)
- **Documentation**: aidlc-docs/ only
- **Project structure patterns**: See code-generation skill for patterns by project type

.github/
├── copilot-instructions.md
└── skills/                # Skills definitions
    ├── aidlc-core/
    ├── aidlc-session/
    ├── aidlc-workspace-detection/
    ├── aidlc-reverse-engineering/
    ├── aidlc-ui-mockup/
    ├── aidlc-requirements/
    ├── aidlc-user-stories/
    ├── aidlc-workflow-planning/
    ├── aidlc-application-design/
    ├── aidlc-units-generation/
    ├── aidlc-development-standards/
    ├── aidlc-functional-design/
    ├── aidlc-nfr/
    ├── aidlc-infrastructure-design/
    ├── aidlc-code-generation/
    ├── aidlc-security-check/
    ├── aidlc-build-test/
    ├── aidlc-operations/
    ├── screen-transition-doc/
    └── webapi-spec/

```

---

# Quick Reference

## Starting a New Workflow
1. Load `aidlc-core` skill for welcome message and terminology
2. Load `aidlc-workspace-detection` skill
3. Check for existing `aidlc-state.md` (if found, use `aidlc-session` skill)

## Resuming a Session  
1. Load `aidlc-session` skill for continuity guidance
2. Read `aidlc-state.md` to determine current stage
3. Load appropriate stage skill

## Stage Execution Pattern
1. Load the stage's skill
2. Read SKILL.md for overview and key rules
3. Load references from `references/` directory as needed
4. Execute stage following skill instructions
5. Wait for user approval before proceeding
6. Log all interactions in audit.md

---
# プロジェクト規則

## 開発環境
- ライブラリ/フレームワークはグローバルインストール禁止
- 仮想環境/コンテナを使用し、依存関係をプロジェクト単位で管理

## ファイル作成・編集
- ファイル書き込み・編集にはcatコマンドは使用不可
- ファイル操作はワークスペース外では実施不可

## 作業規約
- 作業にあたって確認事項があれば、質問すること
- 質問は`[Question]`タグ + `[Answer]`タグで記載、推奨例と質問の背景・目的を提示
- 勝手な判断を実施せずに、ユーザーの承認を求めること

## コード生成
- 生成コード時には実装計画を立て、ファイル破損/破滅的変更を回避すること
- 実装計画・内容は提案前に自身でレビューを実施すること
- 実装計画・内容は必ずユーザーに提示し、承認を得ること
- 計画立案にあたっての質問は`[Question]`タグ + `[Answer]`タグで記載、推奨例と質問の背景・目的を提示

## デバッグ
- デバッグ時には必ず事前に原因分析を実施すること
- 原因分析内容は必ずユーザーに提示し、承認を得る
- 原因分析にあたっての質問は`[Question]`タグ + `[Answer]`タグで記載、推奨例と質問の背景・目的を提示
- 原因分析ではなぜなぜ分析を5回以上繰り返し、根本原因を特定すること

## ドキュメント生成
- 図はmarkdownで表現可能な場合、可能な限りmarkdownで作成

# 禁止事項
- 認証情報のハードコード・ドキュメントに直接記載禁止
- 認証情報などは環境変数や安全なシークレット管理ツールを使用すること
- 環境変数・設定ファイルは`.gitignore`に登録すること