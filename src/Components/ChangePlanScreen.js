import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import db from "../firebase";
import { selectUser } from "../features/userSlice";
import { loadStripe } from "@stripe/stripe-js";
import {
  Container,
  PlanContainer,
  PlanDescription,
  PlanPrice,
  PlanTitle,
  ScreenContainer,
  SubscribeButton,
  Title,
} from "../styles/ChangePlan.styles";

export const ChangePlanScreen = () => {
  const [products, setProducts] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const user = useSelector(selectUser);

  useEffect(() => {
    db.collection("customers")
      .doc(user.uid)
      .collection("subscriptions")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach(async (subscription) => {
          setSubscription({
            role: subscription.data().role,
            current_period_end: subscription.data().current_period_end.seconds,
            current_period_start:
              subscription.data().current_period_start.seconds,
          });
        });
      });
  }, [user.uid]);

  useEffect(() => {
    db.collection("products")
      .where("active", "==", true)
      .get()
      .then((querySnapshot) => {
        const products = {};

        querySnapshot.forEach(async (productDoc) => {
          products[productDoc.id] = productDoc.data();

          const priceSnap = await productDoc.ref.collection("prices").get();
          priceSnap.docs.forEach((price) => {
            products[productDoc.id].prices = {
              priceId: price.id,
              priceData: price.data,
            };
          });
        });
        setProducts(products);
      });
  }, []);

  const loadCheckout = async (priceId) => {
    const docRef = await db
      .collection("customers")
      .doc(user.uid)
      .collection("checkout_sessions")
      .add({
        price: priceId,
        success_url: window.location.origin,
        cancel_url: window.location.origin,
      });

    docRef.onSnapshot(async (snap) => {
      const { error, sessionId } = snap.data();

      if (error) {
        alert(`An error occurred: ${error.message}`);
      }

      if (sessionId) {
        const stripe = await loadStripe(
          "pk_test_51LoajfFxbZ9BipI10qJIIE5ygUBbB4HqRLQaRESa8jk8i6oKYcKhpE53p2aa0jrTGYRC3McmeRIcfuJR5RMlQ7Jd00Z60NjVJm"
        );

        stripe.redirectToCheckout({ sessionId });
      }
    });
  };

  return (
    <Container>
      <ScreenContainer>
        <Title>Change Streaming Plan</Title>
        {subscription && (
          <p>
            Renewal date:{" "}
            {new Date(
              subscription?.current_period_end * 1000
            ).toLocaleDateString()}
          </p>
        )}
        {Object.entries(products).map(([productId, productData]) => {
          const isCurrentPackage = productData.name
            ?.toLowerCase()
            .includes(subscription?.role);

          return (
            <PlanContainer key={productId}>
              <PlanTitle>{productData.name}</PlanTitle>
              <PlanDescription className="changePlanScreen_planDescription">
                {productData.description}
              </PlanDescription>
              <PlanPrice className="changePlanScreen_planPrice">
                GBP 6.99/month
              </PlanPrice>
              <SubscribeButton
                onClick={() =>
                  !isCurrentPackage && loadCheckout(productData.prices.priceId)
                }
              >
                {isCurrentPackage ? "Current Package" : "Subscribe"}
              </SubscribeButton>
            </PlanContainer>
          );
        })}
      </ScreenContainer>
    </Container>
  );
};
