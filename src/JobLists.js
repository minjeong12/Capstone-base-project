import React, { lazy, Suspense, useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  ThemeProvider,
} from "@material-ui/core";
import theme from "./theme/theme";
import SearchBar from "./components/SearchBar";
import { firestore, app } from "./firebase/config";
import { Close as CloseIcon } from "@material-ui/icons";
import { v4 as uuid } from "uuid";

function JobLists(props) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [customSearch, setCustomSearch] = useState(false);
  const [newJobModal, setNewJobModal] = useState(false);
  const [viewJob, setViewJob] = useState({});

  const [searchKeyword, setSearchKeyword] = useState("");

  const fetchJobs = async () => {
    setCustomSearch(false);
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
    console.log(jobs);
    setLoading(false);
  };

  const fetchJobsCustom = async (jobSearch) => {
    setLoading(true);
    setCustomSearch(true);
    const req = await firestore
      .collection("jobs")
      .orderBy("title", "asc")
      .orderBy("postedOn", "desc")

      .where("location", "==", jobSearch.location)
      .where("reward", "==", jobSearch.reward)
      .where("skills", "array-contains", jobSearch.skills)
      .where("sex", "==", jobSearch.sex)
      // .where("title", ">=", jobSearch.title)
      // .where("title", "<=", jobSearch.title + "\uf8ff")
      .get();
    const tempJobs = req.docs.map((job) => ({
      ...job.data(),
      id: job.id,
      postedOn: job.data().postedOn.toDate(),
    }));

    setSearchKeyword(jobSearch.title);
    setJobs(tempJobs);
    setLoading(false);
  };

  const postJob = async (jobDetails, imageUrl) => {
    const id = uuid();
    await firestore
      .collection("jobs")
      .doc(id)
      .set(
        {
          ...jobDetails,
          postedOn: app.firestore.FieldValue.serverTimestamp(),
          imageUrl: imageUrl,
          postId: id,
        },
        { merge: true }
      );
    fetchJobs();
  };

  const updateJob = async (jobDetails, imageUrl) => {
    await firestore
      .collection("jobs")
      .doc(jobDetails.postId)
      .set(
        {
          ...jobDetails,
          postedOn: app.firestore.FieldValue.serverTimestamp(),
          imageUrl: imageUrl,
        },
        { merge: true }
      );
    fetchJobs();
  };

  const deleteJob = async (jobDetails) => {
    await firestore
      .collection("jobs")
      .doc(jobDetails.postId)
      .delete()
      .then(() => console.log("Document deleted")) // Document deleted
      .catch((error) => console.error("Error deleting document", error));
    fetchJobs();
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const appKeyPress = (e) => {
    if (e.key === "Enter") {
      setSearchKeyword(e.target.value);
    }
  };

  const filteredComponents = (jobs) => {
    jobs = jobs.filter((c) => {
      return c.title.indexOf(searchKeyword) > -1;
    });
    return jobs.map((c, index) => {
      return (
        <>
          {jobs.map((job) => (
            <Grid item xs={4}>
              <Box display="flex" justifyContent="row-revers">
                <JobCard open={() => setViewJob(job)} key={job.id} {...job} />
              </Box>
            </Grid>
          ))}
        </>
      );
    });
  };

  const Header = lazy(() => import("./components/Header/index"));
  const NewJobModal = lazy(() => import("./components/Job/NewJobModal"));
  const ViewJobModal = lazy(() => import("./components/Job/ViewJobModal"));
  const JobCard = lazy(() => import("./components/Job/JobCard"));

  console.log(searchKeyword);

  return (
    <ThemeProvider theme={theme} style={{ transition: ".3s" }}>
      <Suspense
        fallback={
          <div>
            <CircularProgress />
          </div>
        }
      >
        <Header openNewJobModal={() => setNewJobModal(true)} />
        <NewJobModal
          closeModal={() => setNewJobModal(false)}
          newJobModal={newJobModal}
          postJob={postJob}
        />
        <ViewJobModal
          job={viewJob}
          closeModal={() => setViewJob({})}
          updateJob={updateJob}
          deleteJob={deleteJob}
        />
        <Box mb={3}>
          <Grid container spacing={2} justify="center">
            <Grid item xs={10}>
              <SearchBar
                fetchJobsCustom={fetchJobsCustom}
                filterSelect={true}
                appKeyPress={appKeyPress}
                // handleFilterTextChange={handleFilterTextChange}
              />
              {loading ? (
                <Box display="flex" justifyContent="center">
                  <CircularProgress />
                </Box>
              ) : (
                <Grid style={{ marginBottom: "5px" }}>
                  {customSearch && (
                    <Box display="flex" justifyContent="flex-end">
                      <Button onClick={fetchJobs}>
                        <CloseIcon size={20} />
                        Custom Search
                      </Button>
                    </Box>
                  )}
                  <Grid container>
                    {jobs && filteredComponents(jobs)}
                    {/* {jobs.map((job) => (
                      <Grid item xs={4}>
                        <Box display="flex" justifyContent="row-revers">
                          <JobCard
                            open={() => setViewJob(job)}
                            key={job.id}
                            {...job}
                          />
                        </Box>
                      </Grid>
                    ))} */}
                  </Grid>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Box>
      </Suspense>
    </ThemeProvider>
  );
}

export default JobLists;
