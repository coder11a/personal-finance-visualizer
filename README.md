# Personal Finance Visualizer

A beautiful and modern web application for tracking personal finances with interactive charts and insights.

## Features

- ✅ Add, edit, and delete transactions
- ✅ Track income and expenses
- ✅ Beautiful monthly expenses chart using Recharts
- ✅ Responsive design with error states
- ✅ Real-time data updates
- ✅ MongoDB Atlas integration
- ✅ Form validation
- ✅ Modern UI with shadcn/ui components

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI Components**: shadcn/ui, Tailwind CSS
- **Charts**: Recharts
- **Database**: MongoDB Atlas
- **Notifications**: Sonner

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB Atlas account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd personal-finance-visualizer
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory and add your MongoDB Atlas connection string:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/finance-tracker?retryWrites=true&w=majority
```

4. Set up MongoDB Atlas:
   - Create a new cluster in MongoDB Atlas
   - Create a database named `finance-tracker`
   - Create a collection named `transactions`
   - Get your connection string from the Atlas dashboard

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Adding Transactions
1. Click the "Add Transaction" button
2. Select transaction type (Income or Expense)
3. Enter amount, description, and date
4. Optionally add a category
5. Click "Add" to save

### Editing Transactions
1. Click the edit icon (pencil) next to any transaction
2. Modify the details
3. Click "Update" to save changes

### Deleting Transactions
1. Click the delete icon (trash) next to any transaction
2. Confirm the deletion

### Viewing Charts
- The monthly overview chart shows income and expenses for the last 12 months
- Hover over chart bars to see detailed information
- The chart updates automatically when you add, edit, or delete transactions


## API Endpoints

- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/[id]` - Update transaction
- `DELETE /api/transactions/[id]` - Delete transaction
- `GET /api/transactions/monthly` - Get monthly aggregated data

## Data Model

### Transaction
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

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
