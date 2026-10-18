// ========= ID ========= //
const mapping = {
  'Locket': ['Gold']
};

// ========= Thiết lập ngày tháng theo ý muốn ========= //
// Bạn có thể sửa ngày đăng ký ở đây (Định dạng: Năm-Tháng-Ngày)
const NGAY_DANG_KY = "2005-10-18T16:00:00Z"; 
const NGAY_HET_HAN = "9999-12-31T23:59:59Z"; // Cố định vĩnh viễn

var ua = $request.headers["User-Agent"] || $request.headers["user-agent"] || "",
    obj = JSON.parse($response.body);

if ($request.url.includes("firebaseremoteconfig")) {
    if (obj.entries) {
        if (obj.entries.gold_membership_enabled) obj.entries.gold_membership_enabled.value = "true";
        if (obj.entries.is_gold_user) obj.entries.is_gold_user.value = "true";
    }
    $done({ body: JSON.stringify(obj) });
} else {
    obj.Attention = "Chúc mừng bạn! Vui lòng không bán hoặc chia sẻ cho người khác!";
    
    // Cấu hình gói mua hàng chi tiết để hiển thị giao diện Gold
    var duyvinh09 = {
          auto_resume_date: null,
          display_name: "locket_1600_1y",
          is_sandbox: true,
          ownership_type: "PURCHASED",
          billing_issues_detected_at: null,
          management_url: "https://apps.apple.com/account/subscriptions",
          period_type: "normal",
          price: { 
            "amount": 399000.0,
            "currency": "VND" 
        },
          expires_date: NGAY_HET_HAN,
          grace_period_expires_date: null,
          refunded_at: null,
          unsubscribe_detected_at: null,
          original_purchase_date: NGAY_DANG_KY,
          purchase_date: NGAY_DANG_KY,
          store: "app_store",
          store_transaction_id: "2000001108724193"
    };

    var locketGold = {
          grace_period_expires_date: null,
          purchase_date: NGAY_DANG_KY,
          product_identifier: "locket_1600_1y",
          expires_date: NGAY_HET_HAN
    };

    const match = Object.keys(mapping).find(e => ua.includes(e));
    if (match) {
        let [e, s] = mapping[match];
        s ? (locketGold.product_identifier = s, 
            obj.subscriber.subscriptions[s] = duyvinh09) : 
            obj.subscriber.subscriptions["locket_1600_1y"] = duyvinh09, 
            obj.subscriber.entitlements[e] = locketGold
    } else {
        obj.subscriber.subscriptions["locket_1600_1y"] = duyvinh09, 
        // Thay thế đoạn ".pro" cũ bằng cấu trúc gán nhãn mới này
        obj.subscriber.entitlements["Gold"] = locketGold;
    }
    $done({
        body: JSON.stringify(obj)
    });
}
