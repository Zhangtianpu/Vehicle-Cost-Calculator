## 1. 架构设计

```mermaid
flowchart TB
    subgraph "前端层 (GitHub Pages 静态部署)"
        "A[React SPA 应用]"
        "B[计算引擎 (纯前端计算)]"
        "C[LocalStorage 持久化]"
        "D[Google AdSense 广告模块]"
    end

    subgraph "页面路由"
        "E[/ → 计算器页面]"
        "F[/compare → 对比页面]"
    end

    "A" --> "B"
    "A" --> "C"
    "A" --> "D"
    "A" --> "E"
    "A" --> "F"
```

本项目为纯前端静态应用，无需后端服务，所有计算逻辑在浏览器端完成，直接部署至 GitHub Pages。

## 2. 技术说明

- **前端框架**：React@18 + TypeScript
- **样式方案**：Tailwind CSS@3
- **构建工具**：Vite
- **路由**：React Router@6（HashRouter，兼容 GitHub Pages）
- **图表库**：Recharts（轻量级 React 图表库）
- **图标库**：Lucide React
- **动画**：CSS Transitions + Framer Motion
- **状态管理**：React Context + useReducer（轻量级，无需 Redux）
- **持久化**：LocalStorage（保存用户输入参数）
- **部署**：GitHub Pages（静态站点，使用 gh-pages 包部署）
- **后端**：无
- **数据库**：无

## 3. 路由定义

| 路由 | 用途 |
|------|------|
| `/` | 计算器主页面，包含三大计算模块与成本汇总 |
| `/compare` | 油车 vs 电车成本对比页面 |

## 4. 项目目录结构

```
src/
├── components/
│   ├── layout/
│   │   ├── Header.tsx          # 顶部导航栏
│   │   ├── Footer.tsx          # 页脚
│   │   ├── AdBanner.tsx        # 广告横幅组件
│   │   └── AdSidebar.tsx       # 侧栏广告组件
│   ├── calculator/
│   │   ├── VehicleTypeToggle.tsx   # 油车/电车切换
│   │   ├── FuelCalculator.tsx      # 油耗/电耗计算器
│   │   ├── InsuranceCalculator.tsx # 保险计算器
│   │   ├── LoanCalculator.tsx      # 车贷计算器
│   │   └── CostSummary.tsx         # 成本汇总面板
│   └── compare/
│       ├── CompareChart.tsx        # 对比图表
│       └── CompareTable.tsx        # 对比详情表格
├── hooks/
│   ├── useCalculator.ts        # 计算逻辑 Hook
│   └── useLocalStorage.ts      # LocalStorage 持久化 Hook
├── context/
│   └── VehicleContext.tsx       # 车辆类型与参数全局状态
├── utils/
│   ├── fuelCalc.ts             # 油耗/电耗计算函数
│   ├── insuranceCalc.ts        # 保险计算函数
│   ├── loanCalc.ts             # 车贷计算函数
│   └── constants.ts            # 默认参数与费率常量
├── pages/
│   ├── CalculatorPage.tsx      # 计算器页面
│   └── ComparePage.tsx         # 对比页面
├── types/
│   └── index.ts                # TypeScript 类型定义
├── App.tsx                     # 根组件（路由配置）
├── main.tsx                    # 入口文件
└── index.css                   # 全局样式 + Tailwind 引入
```

## 5. 核心数据类型定义

```typescript
type VehicleType = "fuel" | "electric";

interface FuelParams {
  monthlyMileage: number;       // 月行驶里程 (km)
  fuelPrice: number;            // 油价 (元/L) / 电价 (元/kWh)
  consumptionPer100km: number;  // 百公里油耗(L) / 电耗(kWh)
}

interface InsuranceParams {
  vehiclePrice: number;         // 车价 (元)
  seatCount: number;            // 座位数
  vehicleAge: number;           // 车龄 (年)
  compulsory: boolean;          // 交强险
  vehicleDamage: boolean;       // 车损险
  thirdPartyLiability: boolean; // 三者险
  thirdPartyAmount: number;     // 三者险保额 (万)
  passengerLiability: boolean;  // 车上人员责任险
  passengerSeats: number;       // 投保座位数
  noClaimYears: number;         // 连续无出险年数
  additionalEV: boolean;       // 电车附加险 (仅电车)
}

interface LoanParams {
  vehiclePrice: number;         // 车价 (元)
  downPaymentRatio: number;     // 首付比例 (0-1)
  loanTermMonths: number;       // 贷款期限 (月)
  annualRate: number;           // 年利率 (%)
  repaymentMethod: "equal_installment" | "equal_principal";
}

interface CalculationResult {
  monthlyCost: number;          // 月度费用
  yearlyCost: number;           // 年度费用
}

interface LoanResult extends CalculationResult {
  monthlyPayment: number;       // 月供 (等额本息) / 首月月供 (等额本金)
  totalInterest: number;        // 总利息
  totalPayment: number;         // 还款总额
  downPayment: number;          // 首付金额
  loanAmount: number;           // 贷款本金
}

interface CostSummary {
  fuel: CalculationResult;
  insurance: CalculationResult;
  loan: CalculationResult;
  totalMonthly: number;
  totalYearly: number;
}
```

## 6. 状态管理架构

```mermaid
flowchart TD
    "A[VehicleContext]" --> "B[vehicleType: fuel/electric]"
    "A" --> "C[fuelParams: FuelParams]"
    "A" --> "D[insuranceParams: InsuranceParams]"
    "A" --> "E[loanParams: LoanParams]"
    "A" --> "F[calculatedResults: CostSummary]"

    "C" --> "G[fuelCalc.ts]"
    "D" --> "H[insuranceCalc.ts]"
    "E" --> "I[loanCalc.ts]"

    "G" --> "F"
    "H" --> "F"
    "I" --> "F"

    "A" --> "J[LocalStorage 同步]"
    "J" --> "K[页面刷新后恢复参数]"
```

### 状态流转说明

1. **VehicleContext** 作为全局状态容器，存储当前车辆类型和所有计算参数
2. 用户修改任何参数时，触发 `dispatch` 更新状态
3. `useEffect` 监听参数变化，调用对应的计算函数，更新 `calculatedResults`
4. 参数变更同时写入 LocalStorage，页面刷新后自动恢复
5. 车辆类型切换时，保留通用参数（月行驶里程、车价等），重置特定参数（油价/电价、油耗/电耗等）

## 7. 广告集成方案

### Google AdSense 集成

- 在 `index.html` 的 `<head>` 中引入 AdSense 脚本
- 广告组件 (`AdBanner`, `AdSidebar`) 封装为独立 React 组件
- 使用 `useEffect` 在组件挂载后调用 `(adsbygoogle = window.adsbygoogle || []).push({})` 触发广告渲染
- 广告位预留 `data-ad-slot` 属性，上线前替换为真实广告单元 ID
- 开发阶段使用占位符展示广告位位置和尺寸

### 广告位配置

| 广告位名称 | 尺寸 | 位置 | 桌面端 | 移动端 |
|-----------|------|------|--------|--------|
| 侧栏广告1 | 300x250 | 右侧栏上方 | 显示 | 隐藏 |
| 侧栏广告2 | 300x250 | 右侧栏下方 | 显示 | 隐藏 |
| 内容横幅1 | 728x90 | 保险计算器与车贷计算器之间 | 显示 | 自适应 |
| 内容横幅2 | 728x90 | 页脚上方 | 显示 | 自适应 |
| 移动插页1 | 自适应 | 油耗计算器下方 | 隐藏 | 显示 |
| 移动插屏2 | 自适应 | 保险计算器下方 | 隐藏 | 显示 |

## 8. 部署方案

### GitHub Pages 部署

1. **构建配置**：`vite.config.ts` 设置 `base` 为仓库名（如 `/VehicleOperatingCostCalculator/`）
2. **路由模式**：使用 `HashRouter`（URL 带 `#`），避免 GitHub Pages 404 问题
3. **部署脚本**：`package.json` 中配置 `deploy` 命令，使用 `gh-pages` 包自动推送 `dist` 目录到 `gh-pages` 分支
4. **CI/CD**：可选配置 GitHub Actions，push 到 main 分支时自动构建部署

### 构建优化

- 代码分割：对比页面使用 `React.lazy` 懒加载
- 资源压缩：Vite 默认开启 gzip 压缩
- 图片优化：使用 SVG 图标，无需图片资源
- 缓存策略：静态资源文件名含 hash，长期缓存
