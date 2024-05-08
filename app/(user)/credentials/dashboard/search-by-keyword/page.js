"use client";

import { setLoadingState } from "@/app/_lib/store/features/Compromised/LoadingSlices";
import { AuthButton } from "@/app/_ui/components/buttons/AuthButton";
import { Select } from "antd";
import clsx from "clsx";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { useRouter, redirect } from "next/navigation";
import { setCookie, getCookie, hasCookie, deleteCookie } from "cookies-next";
import { useEffect, useState } from "react";
import { fetchWithRefreshToken } from "@/app/_lib/token/fetchWithRefreshToken";
import { APIDATAV1 } from "@/app/_lib/helpers/APIKEYS";
import {
  setCallAddKeywordFunctions,
  setIsAddedKeyword,
} from "@/app/_lib/store/features/KeywordSearch/KeywordSearchSlices";

export default function SearchByKeyword() {
  const [usersCredit, setUsersCredit] = useState();
  const [categories, setCategories] = useState();
  const [selectedCategory, setSelectedCategory] = useState("1");
  const [keyword, setKeyword] = useState("");
  const [allKeywordsUser, setAllKeywordsUser] = useState();
  const [triggerChange, setTriggerChange] = useState(false);

  console.log("all keywords: ", allKeywordsUser);

  const canAdd = keyword;

  const handleSetCategories = (value) => {
    setSelectedCategory(value);
  };

  const handleChangeKeyword = (e) => {
    setKeyword(e.target.value);
  };

  const handleAddKeywordButton = () => {
    dispatch(setIsAddedKeyword(true));
    dispatch(setCallAddKeywordFunctions(callPostAddKeywordSearch));
  };

  const dispatch = useDispatch();
  const router = useRouter();

  const patchGetUsersStatus = async () => {
    try {
      dispatch(setLoadingState(true));

      const res = await fetch(`${APIDATAV1}information/keyword`, {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${getCookie("access_token")}`,
        },
      });

      if (res.status === 400) {
        return res;
      }

      if (res.status === 401 || res.status === 403) {
        return res;
      }

      const data = await res.json();

      if (data.error) {
        return res;
      }

      if (data.data === null) {
        throw res;
      }

      if (data.data) {
        setUsersCredit(data.data);
        return res;
      }
    } catch (error) {
      return error;
    } finally {
      dispatch(setLoadingState(false));
    }
  };

  const callPatchUsersStatusCredit = async () => {
    await fetchWithRefreshToken(patchGetUsersStatus, router, dispatch);
  };

  const fetchCategoriesKeyword = async () => {
    try {
      dispatch(setLoadingState(true));

      const res = await fetch(`${APIDATAV1}category/keyword`, {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${getCookie("access_token")}`,
        },
      });

      if (res.status === 400) {
        return res;
      }

      if (res.status === 401 || res.status === 403) {
        return res;
      }

      const data = await res.json();

      if (data.error) {
        return res;
      }

      if (data.data === null) {
        throw res;
      }

      if (data.data) {
        setCategories(data.data);
        return res;
      }
    } catch (error) {
      return error;
    } finally {
      dispatch(setLoadingState(false));
    }
  };

  const callFetchCategoriesKeyword = async () => {
    await fetchWithRefreshToken(fetchCategoriesKeyword, router, dispatch);
  };

  const fetchAllKeywordUsers = async () => {
    try {
      dispatch(setLoadingState(true));

      const res = await fetch(`${APIDATAV1}keyword`, {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${getCookie("access_token")}`,
        },
      });

      if (res.status === 400) {
        return res;
      }

      if (res.status === 401 || res.status === 403) {
        return res;
      }

      const data = await res.json();

      console.log("data keyword users: ", data);

      if (data.data === null) {
        setAllKeywordsUser(null);
        throw res;
      }

      if (data.data) {
        setAllKeywordsUser(data.data);
        return res;
      }
    } catch (error) {
      return error;
    } finally {
      dispatch(setLoadingState(false));
    }
  };

  const callFetchAllKeywordUsers = async () => {
    await fetchWithRefreshToken(fetchAllKeywordUsers, router, dispatch);
  };

  const postKeywordSearch = async () => {
    try {
      dispatch(setLoadingState(true));

      setTriggerChange(false);

      const res = await fetch(`${APIDATAV1}keyword`, {
        method: "POST",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${getCookie("access_token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_category_search: selectedCategory,
          search: keyword,
        }),
      });

      if (res.status === 400) {
        return res;
      }

      if (res.status === 401 || res.status === 403) {
        return res;
      }

      const data = await res.json();

      if (data.data === null) {
        setAllKeywordsUser(null);
        throw res;
      }

      if (data.data) {
        setAllKeywordsUser(data.data);
        setKeyword("");
        setTriggerChange(true);
        return res;
      }
    } catch (error) {
      console.log("error add keyword: ", error);
      return error;
    } finally {
      dispatch(setLoadingState(false));
    }
  };

  const callPostAddKeywordSearch = async () => {
    await fetchWithRefreshToken(postKeywordSearch, router, dispatch);
  };

  useEffect(() => {
    setTriggerChange(false);
    callPatchUsersStatusCredit();
    callFetchCategoriesKeyword();
    callFetchAllKeywordUsers();
  }, [triggerChange]);

  return (
    <>
      <main>
        <section>
          <h1 className="text-black text-heading-2">Search by keyword</h1>

          <section className="bg-white rounded-lg shadow-sm p-10 mt-8">
            <h2 className="text-black text-heading-4">Add keyword</h2>
            <p className="mt-2 text-Base-normal text-text-description">
              Find data leaks based on the keywords you enter. You can only
              enter a maximum of 5 keywords.
            </p>

            <div className="mt-10 flex">
              <Select
                defaultValue={selectedCategory}
                value={selectedCategory}
                size="large"
                className="basis-1/5"
                onChange={handleSetCategories}
                options={
                  categories &&
                  categories.map((category) => ({
                    value: category.id,
                    label: category.category_search,
                  }))
                }
              />
              <input
                type="text"
                className={clsx(
                  "py-3 px-5 text-Base-normal text-[#000000E0] rounded-md border-[1px] border-input-border bg-[#F7F7F7] basis-4/5 ml-6 h-[40px]"
                )}
                placeholder="Type here..."
                value={keyword}
                onChange={handleChangeKeyword}
              />
            </div>
            <p className="text-SM-normal text-[#00000082] text-left mt-4">
              You can only search a maximum of 10 searches.{" "}
              <span className="text-SM-strong text-primary-base">
                {usersCredit && usersCredit.credit}
              </span>{" "}
              Credits
            </p>
            <div className="mt-10 flex justify-end">
              <div>
                <AuthButton
                  value={"Add Keyword"}
                  agreements={canAdd}
                  onClick={handleAddKeywordButton}
                />
              </div>
            </div>
          </section>
        </section>

        <section className="mt-14">
          <h1 className="text-heading-4 text-black">Results of your keyword</h1>
          <section
            className={clsx(
              "bg-white rounded-lg shadow-sm py-8 px-14 text-center mt-8",
              allKeywordsUser === null ? "visible" : "hidden"
            )}
          >
            <div>
              <Image
                src={"/images/sector_image_magnifier.svg"}
                alt="search icon"
                width={120}
                height={120}
                className="mx-auto"
              />
            </div>
            <h3 className="text-heading-4 text-black mt-6">
              Add in your keywords
            </h3>
            <p className="text-LG-normal text-text-description mt-4">
              There are no keywords that you have added yet.
            </p>
          </section>

          <section
            className={clsx(
              "bg-white rounded-lg shadow-sm py-8 px-14 text-center mt-8",
              allKeywordsUser && allKeywordsUser !== null ? "visible" : "hidden"
            )}
          >
            <h3 className="text-heading-4 text-black mt-6">Keywords ada loh</h3>
            <p className="text-LG-normal text-text-description mt-4">
              There are no keywords that you have added yet.
            </p>
          </section>
        </section>
      </main>
    </>
  );
}
