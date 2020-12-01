import { Box, Grid } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { firestore } from "../firebase/config";
import JobCard from "../components/Job/JobCard";
import theme from "../theme/theme";
import { ThemeProvider } from "@material-ui/core";

export default function SearchPage(props) {
  const { match, location } = props;
  const [inputVal, setInputVal] = useState("");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    setLoading(true);
    const req = await firestore
      .collection("jobs")
      .orderBy("postedOn", "desc")
      .get();
    const tempJobs = req.docs.map((job) => ({
      ...job.data(),
      id: job.id,
      postedOn: job.data().postedOn.toDate(),
    }));
    setJobs(tempJobs);
    setLoading(false);
  };

  const filteredComponents = (data) => {
    data = data.filter((c) => {
      return c.title.indexOf(inputVal) > -1;
    });
    return data.map((c, index) => {
      return (
        <>
          <Grid item xs={4}>
            <Box display="flex" justifyContent="row-revers">
              <JobCard key={c.id} {...c} />
            </Box>
          </Grid>
        </>
      );
    });
  };

  useEffect(() => {
    setInputVal(match.params.sId);
    fetchJobs();
  }, [match.params.sId]);

  console.log(inputVal);
  console.log(jobs);

  return (
    <ThemeProvider theme={theme} style={{ transition: ".3s" }}>
      <Box mt={15}>
        <Grid container spacing={2} justify="center">
          <Grid item xs={10}>
            <Grid container>{jobs && filteredComponents(jobs)}</Grid>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
}
