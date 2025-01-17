/* eslint-disable jsx-a11y/alt-text */
import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import DocumentsApi from "../api/DocumentsApi";

export function SuccessPage() {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [searchParams] = useSearchParams();
  const paymentKey = searchParams.get("paymentKey");
  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount");

  // TODO: API를 호출해서 서버에게 paymentKey, orderId, amount를 넘겨주세요.
  // 서버에선 해당 데이터를 가지고 승인 API를 호출하면 결제가 완료됩니다.
  // https://docs.tosspayments.com/reference#%EA%B2%B0%EC%A0%9C-%EC%8A%B9%EC%9D%B8
  async function confirmPayment() {
    try {
      // 필요한 데이터만 객체로 생성
      const paymentData = {
        paymentKey,
        orderId,
        amount,
      };

      // API 호출
      const response = await DocumentsApi.confirmPayment(paymentData);
      if (response.status === 200) {
        setIsConfirmed(true);

        // 결제 완료 처리 API 호출 (orderId를 백엔드로 전달)
        try {
          const completeResponse = await DocumentsApi.completePayment(orderId);
          if (completeResponse.status === 200) {
            console.log("결제 완료 처리 성공");
          } else {
            console.error("결제 완료 처리 실패:", completeResponse);
          }
        } catch (error) {
          console.error("결제 완료 처리 중 오류 발생:", error);
        }
      } else {
        console.error("결제 승인 실패:", response);
      }
    } catch (error) {
      console.error("API 호출 중 오류 발생:", error);
    }
  }

  return (
    <div className="wrapper w-100">
      {isConfirmed ? (
        <div
          className="flex-column align-center confirm-success w-100 max-w-540"
          style={{
            display: "flex",
          }}
        >
          <img
            src="https://static.toss.im/illusts/check-blue-spot-ending-frame.png"
            width="120"
            height="120"
          />
          <h2 className="title">결제를 완료했어요</h2>
          <div className="response-section w-100">
            <div className="flex justify-between">
              <span className="response-label">결제 금액</span>
              <span id="amount" className="response-text">
                {amount}원
              </span>
            </div>
            <div className="flex justify-between">
              <span className="response-label">주문번호</span>
              <span id="orderId" className="response-text">
                {orderId}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="response-label">paymentKey</span>
              <span id="paymentKey" className="response-text">
                {paymentKey}
              </span>
            </div>
          </div>

          <div className="w-100 button-group">
            <div className="flex" style={{ gap: "16px" }}>
              <Link className="btn w-100" to="/">
                홈페이지
              </Link>
              <Link className="btn w-100" to="/myPageNavBar">
                마이페이지
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-column align-center confirm-loading w-100 max-w-540">
          <div className="flex-column align-center">
            <img
              src="https://static.toss.im/lotties/loading-spot-apng.png"
              width="120"
              height="120"
            />
            <h2 className="title text-center">결제 요청까지 성공했어요.</h2>
            <h4 className="text-center description">
              결제 승인하고 완료해보세요.
            </h4>
          </div>
          <div className="w-100">
            <button className="btn primary w-100" onClick={confirmPayment}>
              결제 승인하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
