import React, { useState } from "react";
import { productData } from "../data/tableData";
import { FaSortAmountDown, FaSortAmountDownAlt } from "react-icons/fa";
import { CiTextAlignJustify } from "react-icons/ci";

type SortKey = "name" | "price" | "available" | null;
type SortDirection = "ascending" | "descending" | null;

const ProductTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [data, setData] = useState(productData);
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: SortDirection;
  }>({
    key: null,
    direction: null,
  });
  const originalData = [...productData];
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  // State to track the width of each column
  const [columnWidths, setColumnWidths] = useState({
    productId: 100,
    name: 200,
    price: 150,
    available: 150,
  });

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const currentData = data.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const sortData = (key: SortKey) => {
    let sortedData = [...data];
    let direction: SortDirection = "ascending";

    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    } else if (
      sortConfig.key === key &&
      sortConfig.direction === "descending"
    ) {
      setData(originalData);
      setSortConfig({ key: null, direction: null });
      return;
    }

    if (key === "price") {
      sortedData.sort((a, b) =>
        direction === "ascending" ? a.price - b.price : b.price - a.price
      );
    } else if (key === "name") {
      sortedData.sort((a, b) =>
        direction === "ascending"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name)
      );
    } else if (key === "available") {
      sortedData.sort((a, b) =>
        direction === "ascending"
          ? a.available.localeCompare(b.available)
          : b.available.localeCompare(a.available)
      );
    }

    setData(sortedData);
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  const getSortIcon = (key: SortKey) => {
    if (sortConfig.key !== key) {
      return <CiTextAlignJustify />;
    } else if (sortConfig.direction === "ascending") {
      return <FaSortAmountDownAlt />;
    } else if (sortConfig.direction === "descending") {
      return <FaSortAmountDown />;
    }
    return null;
  };

  const handleRowSelect = (id: number) => {
    setSelectedRows((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((selectedId) => selectedId !== id)
        : [...prevSelected, id]
    );
  };

  const totalSelectedAmount = data
    .filter((product) => selectedRows.includes(product.id))
    .reduce((total, product) => total + product.price, 0);

  const deleteSelectedRows = () => {
    const updatedData = data.filter(
      (product) => !selectedRows.includes(product.id)
    );
    setData(updatedData);
    setSelectedRows([]);
    setCurrentPage(1);
  };

  // Resize handler for columns
  const handleColumnResize = (columnKey: string, newWidth: number) => {
    setColumnWidths((prevWidths) => ({
      ...prevWidths,
      [columnKey]: newWidth,
    }));
  };

  return (
    <div className="items-center justify-center flex-col flex gap-3">
      <h1>Product Table</h1>
      <table border={1} cellPadding="10">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                onChange={(e) => {
                  if (e.target.checked) {
                    const allSelected = currentData.map(
                      (product) => product.id
                    );
                    setSelectedRows((prev) => [
                      ...new Set([...prev, ...allSelected]),
                    ]);
                  } else {
                    const allSelected = currentData.map(
                      (product) => product.id
                    );
                    setSelectedRows((prev) =>
                      prev.filter((id) => !allSelected.includes(id))
                    );
                  }
                }}
              />
            </th>
            <th style={{ width: `${columnWidths.productId}px` }}>
              Product ID
              <div
                onMouseDown={(e) => {
                  const startX = e.pageX;
                  const initialWidth = columnWidths.productId;

                  const onMouseMove = (e: MouseEvent) => {
                    const newWidth = initialWidth + (e.pageX - startX);
                    handleColumnResize("productId", newWidth);
                  };

                  const onMouseUp = () => {
                    document.removeEventListener("mousemove", onMouseMove);
                    document.removeEventListener("mouseup", onMouseUp);
                  };

                  document.addEventListener("mousemove", onMouseMove);
                  document.addEventListener("mouseup", onMouseUp);
                }}
                style={{ cursor: "col-resize", paddingLeft: "10px" }}
              >
                ::
              </div>
            </th>
            <th style={{ width: `${columnWidths.name}px` }}>
              Name
              <button onClick={() => sortData("name")}>
                {getSortIcon("name")}
              </button>
              <div
                onMouseDown={(e) => {
                  const startX = e.pageX;
                  const initialWidth = columnWidths.name;

                  const onMouseMove = (e: MouseEvent) => {
                    const newWidth = initialWidth + (e.pageX - startX);
                    handleColumnResize("name", newWidth);
                  };

                  const onMouseUp = () => {
                    document.removeEventListener("mousemove", onMouseMove);
                    document.removeEventListener("mouseup", onMouseUp);
                  };

                  document.addEventListener("mousemove", onMouseMove);
                  document.addEventListener("mouseup", onMouseUp);
                }}
                style={{ cursor: "col-resize", paddingLeft: "10px" }}
              >
                ::
              </div>
            </th>
            <th style={{ width: `${columnWidths.price}px` }}>
              Price
              <button onClick={() => sortData("price")}>
                {getSortIcon("price")}
              </button>
              <div
                onMouseDown={(e) => {
                  const startX = e.pageX;
                  const initialWidth = columnWidths.price;

                  const onMouseMove = (e: MouseEvent) => {
                    const newWidth = initialWidth + (e.pageX - startX);
                    handleColumnResize("price", newWidth);
                  };

                  const onMouseUp = () => {
                    document.removeEventListener("mousemove", onMouseMove);
                    document.removeEventListener("mouseup", onMouseUp);
                  };

                  document.addEventListener("mousemove", onMouseMove);
                  document.addEventListener("mouseup", onMouseUp);
                }}
                style={{ cursor: "col-resize", paddingLeft: "10px" }}
              >
                ::
              </div>
            </th>
            <th style={{ width: `${columnWidths.available}px` }}>
              Availability
              <button onClick={() => sortData("available")}>
                {getSortIcon("available")}
              </button>
              <div
                onMouseDown={(e) => {
                  const startX = e.pageX;
                  const initialWidth = columnWidths.available;

                  const onMouseMove = (e: MouseEvent) => {
                    const newWidth = initialWidth + (e.pageX - startX);
                    handleColumnResize("available", newWidth);
                  };

                  const onMouseUp = () => {
                    document.removeEventListener("mousemove", onMouseMove);
                    document.removeEventListener("mouseup", onMouseUp);
                  };

                  document.addEventListener("mousemove", onMouseMove);
                  document.addEventListener("mouseup", onMouseUp);
                }}
                style={{ cursor: "col-resize", paddingLeft: "10px" }}
              >
                ::
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((product) => (
            <tr className="border" key={product.id}>
              <td className="border">
                <input
                  type="checkbox"
                  checked={selectedRows.includes(product.id)}
                  onChange={() => handleRowSelect(product.id)}
                />
              </td>
              <td className="border">{product.id}</td>
              <td className="border">{product.name}</td>
              <td className="border">{product.price}</td>
              <td className="border">{product.available}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex gap-3">
        <button
          onClick={goToPrevPage}
          disabled={currentPage === 1}
          className={`rounded-xl w-20 text-white p-1 ${
            currentPage === 1 ? "bg-slate-300" : "bg-sky-400"
          }`}
        >
          Previous
        </button>
        <span style={{ margin: "0 15px" }}>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPages || currentData.length === 0}
          className={`rounded-xl w-20 text-white p-1 ${
            currentPage === totalPages || currentData.length === 0
              ? "bg-slate-300"
              : "bg-sky-400"
          }`}
        >
          Next
        </button>
      </div>
      <div>Total Selected Amount: ${totalSelectedAmount.toFixed(2)}</div>
      <button
        onClick={deleteSelectedRows}
        disabled={selectedRows.length === 0}
        className={`rounded-xl w-20 text-white p-1 mt-2 ${
          selectedRows.length === 0 ? "bg-slate-300" : "bg-red-400"
        }`}
      >
        Delete
      </button>
    </div>
  );
};

export default ProductTable;
