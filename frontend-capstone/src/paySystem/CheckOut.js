import { useEffect, useState } from "react";
import { loadTossPayments, ANONYMOUS } from "@tosspayments/tosspayments-sdk";
import { useLocation, useNavigate } from "react-router-dom";
import DocumentsApi from "../api/DocumentsApi";

const generateRandomString = () => window.btoa(Math.random()).slice(0, 20);
const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";

export function CheckoutPage() {
  const [ready, setReady] = useState(false);
  const [widgets, setWidgets] = useState(null);
  const location = useLocation();
  const productItem = location.state?.productItem;
  const [amount, setAmount] = useState({
    currency: "KRW",
    value: productItem?.price || 0,
  });

  useEffect(() => {
    async function fetchPaymentWidgets() {
      const tossPayments = await loadTossPayments(clientKey);
      const widgets = tossPayments.widgets({ customerKey: ANONYMOUS });
      setWidgets(widgets);
    }

    fetchPaymentWidgets();
  }, [clientKey]);

  useEffect(() => {
    async function renderPaymentWidgets() {
      if (widgets == null) {
        return;
      }
      /**
       * 위젯의 결제금액을 결제하려는 금액으로 초기화하세요.
       * renderPaymentMethods, renderAgreement, requestPayment 보다 반드시 선행되어야 합니다.
       * @docs https://docs.tosspayments.com/sdk/v2/js#widgetssetamount
       */
      await widgets.setAmount(amount);

      await Promise.all([
        /**
         * 결제창을 렌더링합니다.
         * @docs https://docs.tosspayments.com/sdk/v2/js#widgetsrenderpaymentmethods
         */
        widgets.renderPaymentMethods({
          selector: "#payment-method",
          variantKey: "DEFAULT",
        }),
        /**
         * 약관을 렌더링합니다.
         * @docs https://docs.tosspayments.com/reference/widget-sdk#renderagreement선택자-옵션
         */
        widgets.renderAgreement({
          selector: "#agreement",
          variantKey: "AGREEMENT",
        }),
      ]);

      setReady(true);
    }

    renderPaymentWidgets();
  }, [widgets]);

  const handlePayment = async () => {
    const orderId = generateRandomString();
    // 2. 결제 정보를 서버에 저장합니다.
    const formData = new FormData();
    formData.append("fileBoardId", productItem?.fileBoardId); // fileBoardId 전송
    formData.append("orderId", orderId); // 위젯에서 받은 orderId 전송

    // 서버에 결제 정보를 저장하는 요청
    const response = await DocumentsApi.getPaySave(formData);
    console.log(response);

    try {
      // 1. 결제를 요청하기 전에 fileBoardId를 서버로 보냅니다.
      // 서버에 결제 정보를 저장하기 위한 요청

      // 2. 결제 요청
      await widgets?.requestPayment({
        orderId: orderId,
        orderName: productItem?.fileTitle,
        customerName: productItem?.memberName,
        customerEmail: "customer123@gmail.com",
        successUrl:
          window.location.origin + "/sandbox/success" + window.location.search,
        failUrl:
          window.location.origin + "/sandbox/fail" + window.location.search,
      });
    } catch (error) {
      console.error("결제 처리 중 에러 발생:", error);
      // 에러 처리 로직 추가 (UI에 에러 메시지 표시 등)
    }
  };

  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);  // 이전 페이지로 돌아가기
  };

  return (
    <div className="wrapper w-100">
      <div className="max-w-540 w-100">
        <h2>
          {productItem?.univName} - {productItem?.univDept}
        </h2>
        <h3>상품명: {productItem?.fileTitle}</h3>
        <h3>가격: {productItem?.price}원</h3>
        <div id="payment-method" className="w-100" />
        <div id="agreement" className="w-100" />
        <div className="btn-wrapper w-100">
          <button
            className="btn primary w-100"
            onClick={handlePayment} // 결제 처리 함수 호출
          >
            결제하기
          </button>
          <button className="btn primary w-100" onClick={goBack}>뒤로가기</button>
        </div>
      </div>
    </div>
  );
}
export default CheckoutPage;

