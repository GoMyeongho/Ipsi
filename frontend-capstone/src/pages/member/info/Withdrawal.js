import React, { useState, useEffect } from 'react';
import AuthApi from '../../../api/AuthApi';

const Withdrawal = () => {
  const [profit, setProfit] = useState(0);
  const [loading, setLoading] = useState(false);

  // 수익금을 가져오는 함수
  const fetchProfit = async () => {
    setLoading(true);
    const token = localStorage.getItem("accessToken");
    const data = await AuthApi.getRevenue(token);
    setProfit(data);
    setLoading(false);
  };

  // 출금 신청 처리 함수
  const handleWithdrawalRequest = async () => {
    if (profit > 0) {
      const token = localStorage.getItem("accessToken");
      await AuthApi.saveRevenue(profit, token);
      alert(`출금 신청이 완료되었습니다. 수익금: ${profit}원`);
      setProfit(0);
    } else {
      alert('출금 가능한 수익금이 없습니다.');
    }
  };

  useEffect(() => {
    fetchProfit();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', textAlign: 'center' }}>
      <h1 style={{ color: '#333' }}>수익금 인출</h1>
      <div style={{ marginTop :'20px' ,marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '10px'}}>
        <span style={{ fontSize: '18px', fontWeight: 'bold' }}>현재 수익금: {profit}원</span>
        <button
          onClick={fetchProfit}
          disabled={loading}
          style={{
            marginLeft: '10px',
            padding: '8px 15px',
            backgroundColor: '#A16EFF',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? '로딩 중...' : '새로고침'}
        </button>
      </div>
      <button
        onClick={handleWithdrawalRequest}
        style={{
          padding: '10px 20px',
          backgroundColor: '#DCCAFc',
          color: '#333',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        출금 신청
      </button>
    </div>
  );
};

export default Withdrawal;
