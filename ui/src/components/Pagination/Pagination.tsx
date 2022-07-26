import React, { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Advertisement } from "../../types";
import { LIST_ACTIONS } from "../List/ListReducer";
import { ActiveListItem, PaginationList, PaginationListItem } from "./style";

interface PaginationProps {
    records: Advertisement[] | null,
    pageLimit: number,
    pageNeighbours: number,
    dispatch: React.Dispatch<any>,
};

const range = (from, to, step = 1) => {
    let i: number = from;
    const range: number[] = [];

    while (i <= to) {
        range.push(i);
        i += step;
    }

    return range;
}

const LEFT_PAGE = 'LEFT';
const RIGHT_PAGE = 'RIGHT';

export const Pagination = ({ records, pageLimit, pageNeighbours, dispatch }: PaginationProps) => {

    const { page } = useParams();

    const [currentPage, setCurrentPage] = useState((page && (+page > 0)) ? +page : 1);

    const fetchPageNumbers = () => {
        const totalNumbers = (pageNeighbours * 2) + 3;
        const totalBlocks = totalNumbers + 2;

        if (totalPages > totalBlocks) {
            const startPage = Math.max(2, currentPage - pageNeighbours);
            const endPage = Math.min(totalPages - 1, currentPage + pageNeighbours);
            let pages: any[] = range(startPage, endPage);

            const hasLeftSpill = startPage > 2;
            const hasRightSpill = (totalPages - endPage) > 1;
            const spillOffset = totalNumbers - (pages.length + 1);

            switch (true) {
                case (hasLeftSpill && !hasRightSpill): {
                    const extraPages = range(startPage - spillOffset, startPage - 1);
                    pages = [LEFT_PAGE, ...extraPages, ...pages];
                    break;
                }

                case (!hasLeftSpill && hasRightSpill): {
                    const extraPages = range(endPage + 1, endPage + spillOffset);
                    pages = [...pages, ...extraPages, RIGHT_PAGE];
                    break;
                }

                case (hasLeftSpill && hasRightSpill):
                default: {
                    pages = [LEFT_PAGE, ...pages, RIGHT_PAGE];
                    break;
                }
            }

            return [1, ...pages, totalPages];
        }

        return range(1, totalPages);
    };

    const totalPages = records ? Math.ceil(records.length / pageLimit) : 0;

    const pages = fetchPageNumbers();

    useEffect(() => {
        gotoPage(currentPage);
    }, [records]);

    const gotoPage = pageToGo => {
        const newCurrentPage = Math.max(1, Math.min(pageToGo, totalPages));

        const paginationData = {
            newCurrentPage,
            newTotalPages: totalPages,
            newPageLimit: pageLimit,
            totalRecords: records ? records.length : 0
        };

        setCurrentPage(newCurrentPage);

        if (!(window.location.pathname.includes('/myads/0v') || window.location.pathname.includes('/ads/0v'))) {
            let newPath = window.location.pathname.includes('/ads') ? `/apps/classifieds/ads/page/${newCurrentPage}` : `/apps/classifieds/myads/page/${newCurrentPage}`;
            window.history.pushState("", "", newPath);
        }

        dispatch({ type: LIST_ACTIONS.GO_TO_PAGE, payload: paginationData });
    }

    const handleClick = page => evt => {
        evt.preventDefault();
        gotoPage(page);
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }

    const handleMoveLeft = evt => {
        evt.preventDefault();
        gotoPage(currentPage - (pageNeighbours * 2) - 1);
    }

    const handleMoveRight = evt => {
        evt.preventDefault();
        gotoPage(currentPage + (pageNeighbours * 2) + 1);
    }

    return (
        totalPages > 1 ?
            <nav aria-label="Pagination">
                <PaginationList >
                    {pages.map((page, index) => {
                        if (page === LEFT_PAGE) return (
                            <PaginationListItem id={page} key={page} onClick={handleMoveLeft}>
                                <a href="#" aria-label="Previous" >
                                    <span aria-hidden="true">&laquo;</span>
                                </a>
                            </PaginationListItem>
                        );

                        if (page === RIGHT_PAGE) return (
                            <PaginationListItem id={page} key={page} onClick={handleMoveRight}>
                                <a href="#" aria-label="Next">
                                    <span aria-hidden="true">&raquo;</span>
                                </a>
                            </PaginationListItem>
                        );

                        return (
                            page == currentPage ?
                                <ActiveListItem id={page} key={page}><a href="#" >{page}</a> </ActiveListItem> :
                                <PaginationListItem id={page} key={page} onClick={handleClick(page)} >
                                    <a href="#" >{page}</a>
                                </PaginationListItem>
                        );
                    })}
                </PaginationList>
            </nav >
            :
            <></>
    );
};

