import React, { useEffect } from 'react'
import { useState } from 'react';
// Components
import Header from '../components/Header/Header'
import Cards from '../components/Cards/Cards'
import Chart from '../components/Charts/Chart';
import TransactionTable from '../components/TransactionsTable/TransactionTable';
// Modals
import AddIncomeModal from '../components/Modals/addIncome';
import AddExpenseModal from '../components/Modals/addExpense';
// Firebase and others
import { addDoc, collection, getDocs, query } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { toast } from 'react-toastify';
import NoTransactions from '../components/TransactionsTable/NoTransactions';


const Dashboard = () => {
  const [user]=useAuthState(auth);
  const [transactions, setTransactions]=useState([]);
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  const[loading,setLoading]=useState(false);
  const [income , setIncome]=useState(0);
  const [expense, setExpense]=useState(0);
  const [totalBalance , setTotalBalance]=useState(0);
  const showExpenseModal = () => {
    setIsExpenseModalVisible(true);
  };

  const showIncomeModal = () => {
    setIsIncomeModalVisible(true);
  };

  const handleExpenseCancel = () => {
    setIsExpenseModalVisible(false);
  };

  const handleIncomeCancel = () => {
    setIsIncomeModalVisible(false);
  };

  const onFinish=(values,type)=>{
    console.log("On Finish",values,type);
    const newTransaction = {
      type: type,
      date:(values.date).format("YYYY-MM-DD"),
      amount: parseFloat(values.amount),
      tag: values.tag,
      name: values.name,
    };
    addTransaction(newTransaction);
  }
  // for adding transaction
  async function addTransaction(transaction , many) {
    // Adding dc to  firebase
    console.log(user);
    console.log("user", user.uid);
    try {
      const docRef = await addDoc(
        collection(db,`users/${user.uid}/transactions`),
        transaction
      );
      console.log("Document written with ID: ", docRef.id);
      if(!many) toast.success("New Transaction Added !");
      let newArr=transactions;
      setTransactions(prevTransactions => [...prevTransactions, transaction]);  
      calculateBalance();
    } catch (e) {
      console.error("Error adding document: ", e);
      if(!many) toast.error("Couldn't add transaction");  
    }
  }

  async function fetchTransactions() {
    setLoading(true);
    if (user) {
      console.log("Hi")
      const q = query(collection(db, `users/${user.uid}/transactions`));
      const querySnapshot = await getDocs(q);
      
      let transactionsArray = [];
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        transactionsArray.push(doc.data());
      });
      setTransactions(transactionsArray);
      console.log("transaction array", transactionsArray)
      toast.success("Transactions Fetched!");
    }
    setLoading(false);
  }
  useEffect(() => {
    // Get all Docs from collection
    fetchTransactions();   
  }, [user])
  // for calculating Balance
  const calculateBalance = () => {
    let incomeTotal = 0;
    let expensesTotal = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        console.log(transaction.amount)
        incomeTotal += transaction.amount;
      } else {
        expensesTotal += transaction.amount;
      }
    });

    setIncome(incomeTotal);
    setExpense(expensesTotal);
    setTotalBalance(incomeTotal - expensesTotal);
  };
  
  // to sort transaction based on date
  let sortedTransactions=transactions.sort((a,b)=>{
    return new Date(a.date)-new Date(b.date);
  })

  useEffect(()=>{
    calculateBalance();
  }, [transactions]);
  
  return (
    <div>
    <Header/>
   { loading ? (
   <p>Loading...</p>
   ) : (
   <>
    <Cards
    income={income}
    expense={expense}
    totalBalance={totalBalance}
    showExpenseModal={showExpenseModal}
    showIncomeModal={showIncomeModal}
    />
    {transactions && transactions.length !=0 ? (<Chart sortedTransactions={sortedTransactions}/>) : (<NoTransactions/>)}
    <AddExpenseModal
            isExpenseModalVisible={isExpenseModalVisible}
            handleExpenseCancel={handleExpenseCancel}
            onFinish={onFinish}
          />
          <AddIncomeModal
            isIncomeModalVisible={isIncomeModalVisible}
            handleIncomeCancel={handleIncomeCancel}
            onFinish={onFinish}
          />
          <TransactionTable transactions={transactions} addTransaction={addTransaction} fetchTransactions={fetchTransactions}/>
   </>
)}
    </div>
    
  )
}

export default Dashboard