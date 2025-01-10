package kh.BackendCapstone.service;

import kh.BackendCapstone.dto.request.PaymentsReqDto;
import kh.BackendCapstone.dto.response.PaymentsResDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor

public class PaymentsService {

    private static final String TOSS_API_URL = "https://api.tosspayments.com/v1/payments/confirm";
    private static final String TOSS_SECRET_KEY = "test_sk_LkKEypNArWeeXlQWZgNl3lmeaxYG";

    public PaymentsResDto confirmPayments(PaymentsReqDto request) {
        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {

            HttpPost httpPost = new HttpPost(TOSS_API_URL);
            httpPost.setHeader("Content-Type", "application/json");
            httpPost.setHeader("Authorization", "Basic " +
                    java.util.Base64.getEncoder().encodeToString((TOSS_SECRET_KEY + ":").getBytes()));

            String json = String.format(
                    "{\"paymentKey\":\"%s\",\"orderId\":\"%s\",\"amount\":%d}",
                    request.getPaymentKey(),
                    request.getOrderId(),
                    request.getAmount()
            );
            httpPost.setEntity(new StringEntity(json));

            try (CloseableHttpResponse response = httpClient.execute(httpPost)) {
                String responseString = EntityUtils.toString(response.getEntity());
                if (response.getStatusLine().getStatusCode() == 200) {
                    return new PaymentsResDto(true, "Payment approved successfully", responseString);
                }else {
                    return new PaymentsResDto(false, "Failed to approve payment", responseString);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new PaymentsResDto(false, "An error occurred while processing the payment", e.getMessage());
        }
    }

}