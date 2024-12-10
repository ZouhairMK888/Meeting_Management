function Validation(values) {
    let errors = {};

    const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!values.email) {
        errors.email = "Email is required";
    } else if (!email_pattern.test(values.email)) {
        errors.email = "Invalid email format";
    }

    if (!values.password) {
        errors.password = "Password is required";
    }
    
    return errors;
}

export default Validation;
