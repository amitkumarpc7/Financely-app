import React from 'react'
import { Line, Pie } from '@ant-design/charts';
import { Card, Row } from "antd";



// Imported props from dashboard
const Chart=({sortedTransactions})=> {
    const data = sortedTransactions.map((item) => {
        return {date:item.date , amount: item.amount}
    })
    let spendingData = sortedTransactions.filter((transaction)=>{
        if(transaction.type == 'expense'){
            return {tag: transaction.tag,amount:transaction.amount}
        }
    })
    let finalSpendings = spendingData.reduce((acc,obj)=>{
        let key = obj.tag;
        if(!acc[key]){
            acc[key] = {tag:obj.tag,amount:obj.amount};
        }else{
            acc[key].amount += obj.amount;
        }
        return acc;
    },{});

    // for totalling each tags
    let newSpending = [
        { tag: "Food", amount: 0 },
        { tag: "Education", amount: 0 },
        { tag: "Investment", amount: 0 },
      ];
      spendingData.forEach((item) => {
        if (item.tag.toLowerCase() == "food") {
          newSpending[0].amount += item.amount;
        } else if (item.tag.toLowerCase() == "education") {
          newSpending[1].amount += item.amount;
        } else {
          newSpending[2].amount += item.amount;
        }
      });
    const config = {
      data,
      width: 500,
      autoFit: true,
      xField: 'date',
      yField: 'amount',
      tooltip: {
        formatter: (datum) => ({
          name: "Amount",
          value: `$${datum.amount.toFixed(2)}`,
        }),
      },
      
    };
   const spendingConfig = {
    data:spendingData,
    // width: 500,
    angleField:"amount",
    colorField:"tag",
   };
 
   let chart;
   let pieChart;
      return (
        <div>
            <Row gutter={16}>
                <Card bordered={true} className="cardStyle" >
                <h2>Financial Statistics</h2>
                <Line {...config} onReady={(chartInstance) => (chart = chartInstance)} />
                </Card>
                <Card bordered={true} className="cardStyle" style={{ flex: 0.45 }}>
                <h2>Your Spendings</h2>
                <Pie {...spendingConfig} onReady={(chartInstance) => (pieChart = chartInstance)} />
                </Card>
   
            </Row>

        </div>
       
      )
  
}

export default Chart;