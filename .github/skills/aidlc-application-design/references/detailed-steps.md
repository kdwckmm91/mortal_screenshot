
# Application Design - Detailed Steps

## Purpose
**High-level component identification and service layer design**

Application Design focuses on:
- Identifying main functional components and their responsibilities
- Defining component interfaces (not detailed business logic)
- Designing service layer for orchestration
- Establishing component dependencies and communication patterns

**Note**: Detailed business logic design happens later in Functional Design (per-unit, CONSTRUCTION phase)

## Prerequisites
- Context Assessment must be complete
- Requirements Assessment recommended (provides functional context)
- Story Development recommended (user stories guide design decisions)
- Execution plan must indicate Application Design stage should execute

## Step-by-Step Execution

### 0. Web UI判定とUI Mockup状態確認

**目的**: Web UIアプリケーションの場合、UI Mockupとの連携を確認

#### 0.1 Web UI判定
1. `aidlc-state.md` の `Web UI Detected` を確認
2. **No** の場合: このセクション（Step 0）を完全にスキップし、Step 1へ
3. **Yes** の場合: Step 0.2へ進む

#### 0.2 UI Mockup完了状態の確認
1. `aidlc-state.md` の Stage Progress を確認
2. UI Mockupが `[x]` の場合: 正常、Step 1へ
3. UI Mockupが `[ ]` または未記載の場合: ユーザーに新規作成を提案

**UI Mockup未実行時の提案メッセージ:**
```markdown
# ⚠️ UI Mockup未実行の検出

Web UIアプリケーションですが、UI Mockupステージがスキップされています。

Application Designを進める前に、UI Mockupを作成することを推奨します。
画面イメージがあると、コンポーネント設計の精度が向上します。

> **🚀 <u>**WHAT'S NEXT?**</u>**
>
> 🎨 **UI Mockupを作成** - UI Mockupステージに移行
> ⏭️ **スキップ** - Mockupなしで設計を続行
```

- ユーザーが「UI Mockupを作成」を選択: UI Mockupスキルに制御移行
- ユーザーが「スキップ」を選択: Step 1へ進む

### 1. Analyze Context
- Read `aidlc-docs/inception/requirements/requirements.md` and `aidlc-docs/inception/user-stories/stories.md`
- **Web UIアプリの場合**: `aidlc-docs/inception/ui-mockup/` も読み込み
- Identify key business capabilities and functional areas
- Determine design scope and complexity

### 2. Create Application Design Plan
- Generate plan with checkboxes [] for application design
- Focus on components, responsibilities, methods, business rules, and services
- Each step and sub-step should have a checkbox []

### 3. Include Mandatory Design Artifacts in Plan
- **ALWAYS** include these mandatory artifacts in the design plan:
  - [ ] Generate components.md with component definitions and high-level responsibilities
  - [ ] Generate component-methods.md with method signatures (business rules detailed later in Functional Design)
  - [ ] Generate services.md with service definitions and orchestration patterns
  - [ ] Generate component-dependency.md with dependency relationships and communication patterns
  - [ ] Validate design completeness and consistency

### 4. Generate Context-Appropriate Questions
**DIRECTIVE**: Analyze the requirements and stories to generate ONLY questions relevant to THIS specific application design. Use the categories below as inspiration, NOT as a mandatory checklist. Skip entire categories if not applicable.

- EMBED questions using [Answer]: tag format
- Focus on ambiguities and missing information specific to this context
- Generate questions only where user input is needed for design decisions

**Example question categories** (adapt as needed):
- **Component Identification** - Only if component boundaries or organization is unclear
- **Component Methods** - Only if method signatures need clarification (detailed business rules come later)
- **Service Layer Design** - Only if service orchestration or boundaries are ambiguous
- **Component Dependencies** - Only if communication patterns or dependency management is unclear
- **Design Patterns** - Only if architectural style or pattern choice needs user input

### 5. Store Application Design Plan
- Save as `aidlc-docs/inception/plans/application-design-plan.md`
- Include all [Answer]: tags for user input
- Ensure plan covers all design aspects

### 6. Request User Input
- Ask user to fill [Answer]: tags directly in the plan document
- Emphasize importance of design decisions
- Provide clear instructions on completing the [Answer]: tags

### 7. Collect Answers
- Wait for user to provide answers to all questions using [Answer]: tags in the document
- Do not proceed until ALL [Answer]: tags are completed
- Review the document to ensure no [Answer]: tags are left blank

### 8. ANALYZE ANSWERS (MANDATORY)
Before proceeding, you MUST carefully review all user answers for:
- **Vague or ambiguous responses**: "mix of", "somewhere between", "not sure", "depends"
- **Undefined criteria or terms**: References to concepts without clear definitions
- **Contradictory answers**: Responses that conflict with each other
- **Missing design details**: Answers that lack specific guidance
- **Answers that combine options**: Responses that merge different approaches without clear decision rules

### 9. MANDATORY Follow-up Questions
If the analysis in step 8 reveals ANY ambiguous answers, you MUST:
- Add specific follow-up questions to the plan document using [Answer]: tags
- DO NOT proceed to approval until all ambiguities are resolved
- Examples of required follow-ups:
  - "You mentioned 'mix of A and B' - what specific criteria should determine when to use A vs B?"
  - "You said 'somewhere between A and B' - can you define the exact middle ground approach?"
  - "You indicated 'not sure' - what additional information would help you decide?"
  - "You mentioned 'depends on complexity' - how do you define complexity levels?"

### 10. Generate Application Design Artifacts
- Execute the approved plan to generate design artifacts
- Create `aidlc-docs/inception/application-design/components.md` with:
  - Component name and purpose
  - Component responsibilities
  - Component interfaces
- Create `aidlc-docs/inception/application-design/component-methods.md` with:
  - Method signatures for each component
  - High-level purpose of each method
  - Input/output types
  - Note: Detailed business rules will be defined in Functional Design (per-unit, CONSTRUCTION phase)
- Create `aidlc-docs/inception/application-design/services.md` with:
  - Service definitions
  - Service responsibilities
  - Service interactions and orchestration
- Create `aidlc-docs/inception/application-design/component-dependency.md` with:
  - Dependency matrix showing relationships
  - Communication patterns between components
  - Data flow diagrams

### 10.5 UI-コンポーネントマッピング作成（Web UIアプリのみ）

**条件**: `aidlc-state.md` の `Web UI Detected: Yes` かつ UI Mockupが完了している場合のみ実行

1. `aidlc-docs/inception/ui-mockup/screen-inventory.md` を参照
2. 各画面と対応するコンポーネントをマッピング
3. `aidlc-docs/inception/application-design/ui-component-mapping.md` を作成:

```markdown
# UI-Component Mapping

## 画面-コンポーネント対応表

| 画面 | 使用コンポーネント | 説明 |
|------|------------------|------|
| ログイン画面 | AuthComponent, FormComponent | ユーザー認証UI |
| ダッシュボード | DashboardComponent, ChartComponent | メイン画面 |

## コンポーネント-画面逆引き

| コンポーネント | 使用画面 | 役割 |
|--------------|---------|------|
| AuthComponent | ログイン画面 | 認証処理 |
| FormComponent | ログイン画面, 設定画面 | フォーム入力 |
```

### 10.6 UI変更必要性の評価（Web UIアプリのみ）

**条件**: `aidlc-state.md` の `Web UI Detected: Yes` の場合のみ実行

#### 評価項目

設計成果物とUI Mockupを比較し、以下を評価:

| 評価項目 | チェック内容 |
|---------|------------|
| 新規画面の必要性 | 設計で新たに必要になった画面があるか |
| 既存画面の変更 | コンポーネント設計により画面構成の変更が必要か |
| 画面遷移の変更 | 新しいフローや遷移パスが必要か |
| コンポーネント配置の変更 | UIレイアウトの変更が必要か |

#### 評価結果の処理

| 評価結果 | アクション |
|---------|-----------|
| 変更なし | Step 11へ進む |
| 変更あり | Mockup修正提案メッセージを表示 |

**Mockup修正提案メッセージ:**
```markdown
# 🎨 UI Mockup修正の提案

Application Designの結果、以下のUI変更が推奨されます:

**新規画面:**
- [画面名]: [理由]

**変更が必要な画面:**
- [画面名]: [変更内容と理由]

**画面遷移の変更:**
- [変更内容]

> **🚀 <u>**WHAT'S NEXT?**</u>**
>
> 🎨 **Mockupを修正** - UI Mockupステージに戻って修正
> ⏭️ **後で修正** - 現状のまま設計を続行（CONSTRUCTIONで対応）
> ✅ **変更不要** - 提案を却下して次に進む
```

- **「Mockupを修正」選択時**:
  1. UI Mockupスキルに制御を移行
  2. 修正完了後、Application Designに戻る
  3. 必要に応じて設計成果物を更新（Step 10を再実行）
- **「後で修正」または「変更不要」選択時**: Step 11へ進む

### 11. Log Approval
- Log approval prompt with timestamp in `aidlc-docs/audit.md`
- Include complete approval prompt text
- Use ISO 8601 timestamp format

### 12. Present Completion Message

```markdown
# 🏗️ Application Design Complete

[AI-generated summary of application design artifacts created in bullet points]

> **📋 <u>**REVIEW REQUIRED:**</u>**  
> Please examine the application design artifacts at: `aidlc-docs/inception/application-design/`

> **🚀 <u>**WHAT'S NEXT?**</u>**
>
> **You may:**
>
> 🔧 **Request Changes** - Ask for modifications to the application design if required
> [IF Units Generation is skipped:]
> 📝 **Add Units Generation** - Choose to include **Units Generation** stage (currently skipped)
> ✅ **Approve & Continue** - Approve design and proceed to **[Units Generation/CONSTRUCTION PHASE]**
```

### 13. Wait for Explicit Approval
- Do not proceed until the user explicitly approves the application design
- Approval must be clear and unambiguous
- If user requests changes, update the design and repeat the approval process

### 14. Record Approval Response
- Log the user's approval response with timestamp in `aidlc-docs/audit.md`
- Include the exact user response text
- Mark the approval status clearly

### 15. Update Progress
- Mark Application Design stage complete in `aidlc-docs/aidlc-state.md`
- Update the "Current Status" section
- Prepare for transition to next stage
