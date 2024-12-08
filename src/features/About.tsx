import { Link, useLocation } from "react-router";

function About() {
  const location = useLocation();
  const redirectTo = location.state?.from;

  return <Link to={redirectTo}> Back</Link>;
}
export default About;
