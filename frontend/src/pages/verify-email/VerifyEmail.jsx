import "./verify-email.css";
import { Link,useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { verifyEmail } from "../../redux/apiCalls/authApiCall";

const VerifyEmail = () => {
  const { userId, token } = useParams();
  const dispatch = useDispatch();
  // @ts-ignore
  const { isEmailVerified } = useSelector((state) => state.auth);

  useEffect(() => {
    // @ts-ignore
    dispatch(verifyEmail(userId, token))
  }, [userId, token]);

  return (
    <section className="verfiy-email">
      {isEmailVerified ? (
        <>
          <i className="bi bi-patch-check verify-email-icon"></i>
          <h1 className="verfiy-email-title">
            Your email address has been successfully verified
          </h1>
          <Link to="/login" className="verify-email-link">
            Go To Login Page
          </Link>
        </>
      ) : (
        <>
          <h1 className="verify-email-not-found">Not Found</h1>
        </>
      )}
    </section>
  );
};

export default VerifyEmail;
