# 💰 Personal Finance Visualizer

A stunning, modern web application for comprehensive personal finance management with beautiful visualizations, smart insights, and budget tracking capabilities.


## ✨ Features

### 🎯 **Core Functionality**
- ✅ **Transaction Management**: Add, edit, and delete income/expense transactions
- ✅ **Real-time Updates**: Instant data synchronization across all components
- ✅ **Form Validation**: Comprehensive input validation with error handling
- ✅ **Responsive Design**: Beautiful experience across all devices

### 📊 **Advanced Analytics**
- ✅ **Monthly Trends**: Interactive charts showing income vs expenses over time
- ✅ **Category Breakdown**: Beautiful pie charts for expense and income categories
- ✅ **Budget vs Actual**: Compare planned budgets with actual spending
- ✅ **Spending Insights**: AI-powered insights and financial recommendations

### 💡 **Smart Features**
- ✅ **Predefined Categories**: 12 expense categories + 6 income categories
- ✅ **Monthly Budgets**: Set and track category-wise monthly budgets
- ✅ **Progress Tracking**: Visual progress bars and budget alerts
- ✅ **Financial Insights**: Average daily spending, trends, and patterns

### 🎨 **Modern Design**
- ✅ **Glass Morphism**: Beautiful backdrop blur effects
- ✅ **Animated Elements**: Smooth hover effects and transitions
- ✅ **Gradient Design**: Modern gradient backgrounds and text
- ✅ **Dark Mode**: Full dark mode support
- ✅ **Custom Animations**: Fade-in, slide, and scale animations

### 📱 **User Experience**
- ✅ **Dashboard Overview**: Comprehensive financial summary at a glance
- ✅ **Recent Transactions**: Quick view of latest financial activities
- ✅ **Month Navigation**: Easy switching between different time periods
- ✅ **Loading States**: Beautiful shimmer effects and skeleton screens

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5
- **UI Library**: React 19 with Hooks
- **Styling**: Tailwind CSS with custom animations
- **Components**: shadcn/ui component library
- **Charts**: Recharts for data visualization

### **Backend**
- **Database**: MongoDB Atlas with aggregation pipelines
- **API**: Next.js API Routes with TypeScript
- **Validation**: Comprehensive input validation
- **Error Handling**: Graceful error handling and user feedback

### **Additional Libraries**
- **Notifications**: Sonner for toast notifications
- **Icons**: Lucide React for beautiful icons
- **Animations**: Custom CSS animations and transitions

## 🚀 Getting Started

### Prerequisites

- **Node.js**: 18+ (LTS recommended)
- **MongoDB Atlas**: Free cloud database account
- **Git**: For version control

### Installation

1. **Clone the repository**:
```bash
git clone <repository-url>
cd personal-finance-visualizer
```

2. **Install dependencies**:
```bash
npm install
```

3. **Set up environment variables**:
Create a `.env.local` file in the root directory:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/finance-tracker?retryWrites=true&w=majority
```

4. **Configure MongoDB Atlas**:
   - Create a new cluster in MongoDB Atlas
   - Create a database named `finance-tracker`
   - Collections will be created automatically:
     - `transactions` - for financial transactions
     - `budgets` - for monthly category budgets
   - Get your connection string from the Atlas dashboard

5. **Run the development server**:
```bash
npm run dev
```

6. **Open your browser**:
Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage Guide

### 🏠 **Dashboard Overview**
The main dashboard provides a comprehensive view of your financial health:
- **Summary Cards**: Total income, expenses, and current balance
- **Spending Insights**: Smart analytics and recommendations
- **Budget Management**: Set and track monthly category budgets
- **Visual Charts**: Interactive pie charts and trend analysis

### 💳 **Managing Transactions**

#### Adding Transactions
1. Click "Add Transaction" button
2. Select transaction type (Income/Expense)
3. Choose from predefined categories
4. Enter amount, description, and date
5. Save to see real-time updates

#### Editing Transactions
1. Click the edit icon (✏️) next to any transaction
2. Modify the details as needed
3. Click "Update" to save changes

#### Deleting Transactions
1. Click the delete icon (🗑️) next to any transaction
2. Confirm the deletion in the popup

### 📊 **Budget Management**

#### Setting Monthly Budgets
1. Navigate to the Budget Management section
2. Click "Add Budget"
3. Select month and category
4. Enter budget amount
5. Save to start tracking

#### Monitoring Budget Progress
- **Progress Bars**: Visual indicators of budget usage
- **Color Coding**: Green (under budget), Yellow (near limit), Red (over budget)
- **Remaining Amount**: See exactly how much is left in each category

### 📈 **Analytics & Insights**

#### Category Breakdown
- **Pie Charts**: Visual representation of spending by category
- **Interactive Legend**: Click categories to highlight them
- **Percentage Display**: See exact spending distribution

#### Monthly Trends
- **Bar Charts**: Compare income vs expenses over time
- **Hover Details**: Get specific amounts on hover
- **Responsive Design**: Charts adapt to screen size

#### Smart Insights
- **Highest Spending**: Identify your biggest expense categories
- **Daily Averages**: Understand your spending patterns
- **Trend Analysis**: Month-over-month comparisons
- **Transaction Count**: Track your financial activity

## 🔌 API Endpoints

### **Transactions**
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/[id]` - Update transaction
- `DELETE /api/transactions/[id]` - Delete transaction
- `GET /api/transactions/monthly` - Get monthly aggregated data
- `GET /api/transactions/categories` - Get category breakdown

### **Budgets**
- `GET /api/budgets` - Get budgets for a month
- `POST /api/budgets` - Create new budget
- `DELETE /api/budgets/[id]` - Delete budget
- `GET /api/budgets/comparison` - Get budget vs actual comparison

### **Analytics**
- `GET /api/insights` - Get spending insights and recommendations

## 📊 Data Models

### **Transaction**
```typescript
interface Transaction {
  _id?: string;
  amount: number;
  description: string;
  date: string;
  type: 'income' | 'expense';
  category?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
```

### **Budget**
```typescript
interface Budget {
  _id?: string;
  month: string; // Format: "YYYY-MM"
  category: string;
  amount: number;
  createdAt?: Date;
  updatedAt?: Date;
}
```

### **Category Data**
```typescript
interface CategoryData {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}
```

### **Spending Insight**
```typescript
interface SpendingInsight {
  type: 'highest' | 'lowest' | 'trend' | 'category';
  title: string;
  description: string;
  value: string;
  icon: string;
  color: string;
}
```

## 🎨 Design Features

### **Visual Elements**
- **Glass Morphism**: Modern backdrop blur effects
- **Gradient Backgrounds**: Beautiful color transitions
- **Animated Icons**: Smooth hover and interaction effects
- **Custom Scrollbars**: Styled scrollbars with gradients
- **Loading States**: Shimmer effects and skeleton screens

### **Animations**
- **Fade-in Effects**: Smooth entrance animations
- **Hover Transitions**: Cards lift and scale on hover
- **Progress Animations**: Animated progress bars
- **Staggered Delays**: Sequential animation timing

### **Responsive Design**
- **Mobile First**: Optimized for all screen sizes
- **Touch Friendly**: Large touch targets for mobile
- **Adaptive Layout**: Components adjust to screen width
- **Performance Optimized**: Fast loading and smooth interactions

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** and test thoroughly
4. **Commit your changes**: `git commit -m 'Add amazing feature'`
5. **Push to the branch**: `git push origin feature/amazing-feature`
6. **Open a Pull Request**

### **Development Guidelines**
- Follow TypeScript best practices
- Maintain consistent code formatting
- Add proper error handling
- Include loading states for better UX
- Test on multiple devices and browsers

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **shadcn/ui** for beautiful component library
- **Recharts** for excellent charting capabilities
- **Tailwind CSS** for utility-first styling
- **MongoDB Atlas** for reliable cloud database
- **Next.js Team** for the amazing framework

## 📞 Support

If you have any questions or need help:
- Create an issue on GitHub
- Check the documentation above
- Review the code comments for implementation details

---
*Personal Finance Visualizer • Track • Analyze • Grow*
