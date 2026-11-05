document.addEventListener("DOMContentLoaded", () => {
  const rawProducts = [
    { id: 1, name: "Nasi Goreng", category: "Makanan", sold: 38, price: 10000 },
    { id: 2, name: "Mie Ayam", category: "Makanan", sold: 23, price: 8000 },
    { id: 3, name: "Nasi Uduk", category: "Makanan", sold: 23, price: 7000 },
    { id: 4, name: "Air Mineral", category: "Minuman", sold: 34, price: 4000 },
    { id: 5, name: "Es Teh Manis", category: "Minuman", sold: 42, price: 3000 },
    { id: 6, name: "Jus Alpukat", category: "Minuman", sold: 18, price: 10000 },
    {
      id: 7,
      name: "Keripik Singkong",
      category: "Snack",
      sold: 28,
      price: 5000,
    },
    { id: 8, name: "Roti Bakar", category: "Snack", sold: 20, price: 8000 },
    {
      id: 9,
      name: "Gorengan Assorted",
      category: "Snack",
      sold: 25,
      price: 2000,
    },
    { id: 10, name: "Kopi Susu", category: "Minuman", sold: 10, price: 6000 },
  ];

  const dailyOmzetData = [
    { label: "Sab, 17", value: 220000 },
    { label: "Min, 18", value: 164000 },
    { label: "Sen, 19", value: 198000 },
    { label: "Sel, 20", value: 220000 },
    { label: "Rab, 21", value: 194000 },
    { label: "Kam, 22", value: 155000 },
    { label: "Jum, 23", value: 259000 },
  ];

  const promoList = [
    {
      emoji: "🍜",
      title: "Senin Hemat",
      desc: "Mie Ayam cuma Rp7.000",
      tag: "SENIN",
      color: "blue",
    },
    {
      emoji: "🍳",
      title: "Paket Sarapan",
      desc: "Nasi Uduk + Es Teh Rp9.000",
      tag: "SETIAP HARI",
      color: "yellow",
    },
    {
      emoji: "🍌",
      title: "Menu Baru",
      desc: "Pisang Goreng Coklat",
      tag: "MINGGU INI",
      color: "teal",
    },
    {
      emoji: "💧",
      title: "Jumat Berkah",
      desc: "Air mineral gratis tiap beli makanan",
      tag: "JUMAT",
      color: "red",
    },
  ];

  let activeProducts = [...rawProducts];
  let selectedCategories = ["Makanan", "Minuman", "Snack"];

  const formatRp = (num) => "Rp" + num.toLocaleString("id-ID");

  const btnTheme = document.getElementById("btnTheme");
  btnTheme.addEventListener("click", () => {
    const currentMode =
      document.documentElement.getAttribute("data-color-mode") === "dark"
        ? "light"
        : "dark";
    document.documentElement.setAttribute("data-color-mode", currentMode);
    btnTheme.querySelector("span").textContent =
      currentMode === "dark" ? "Mode terang" : "Mode gelap";
    updateChartsTheme();
  });

  const fDate = flatpickr("#fDate", {
    mode: "range",
    dateFormat: "d M Y",
    defaultDate: ["2026-10-17", "2026-10-23"],
    locale: flatpickr.l10ns.id,
    onChange: (selectedDates) => {
      if (selectedDates.length === 2) updateDashboard();
    },
  });

  const fKatSelect = document.getElementById("fKat");
  ["Makanan", "Minuman", "Snack"].forEach((cat) => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    opt.selected = true;
    fKatSelect.appendChild(opt);
  });

  new TomSelect("#fKat", {
    plugins: ["remove_button"],
    placeholder: "Pilih kategori...",
    onChange: (values) => {
      selectedCategories = values;
      updateDashboard();
    },
  });

  const tooltipEl = document.getElementById("tooltip");
  document.querySelectorAll("[data-tip]").forEach((btn) => {
    const updatePosition = () => {
      tooltipEl.textContent = btn.getAttribute("data-tip");
      FloatingUI.computePosition(btn, tooltipEl, {
        placement: "top",
        middleware: [FloatingUI.offset(8), FloatingUI.shift({ padding: 5 })],
      }).then(({ x, y }) => {
        Object.assign(tooltipEl.style, {
          left: `${x}px`,
          top: `${y}px`,
          opacity: "1",
        });
      });
    };
    btn.addEventListener("mouseenter", updatePosition);
    btn.addEventListener("focus", updatePosition);
    btn.addEventListener("mouseleave", () => {
      tooltipEl.style.opacity = "0";
    });
    btn.addEventListener("blur", () => {
      tooltipEl.style.opacity = "0";
    });
  });

  const getChartColors = () => {
    const isDark =
      document.documentElement.getAttribute("data-color-mode") === "dark";
    return {
      text: isDark ? "#A9ABAF" : "#6B6E76",
      grid: isDark ? "#E3E4F21F" : "#0B120E24",
    };
  };

  const ctxBar = document.getElementById("cBar").getContext("2d");
  const barChart = new Chart(ctxBar, {
    type: "bar",
    data: {
      labels: dailyOmzetData.map((d) => d.label),
      datasets: [
        {
          data: dailyOmzetData.map((d) => d.value),
          backgroundColor: "#357DE8",
          borderRadius: 4,
          barThickness: 24,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: getChartColors().text },
        },
        y: {
          grid: { color: getChartColors().grid },
          ticks: {
            color: getChartColors().text,
            callback: (v) => v / 1000 + "rb",
          },
        },
      },
    },
  });

  const ctxDn = document.getElementById("cDn").getContext("2d");
  const donutChart = new Chart(ctxDn, {
    type: "doughnut",
    data: {
      labels: ["Makanan", "Minuman", "Snack"],
      datasets: [
        {
          data: [0, 0, 0],
          backgroundColor: ["#357DE8", "#82B536", "#BF63F3"],
          borderWidth: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "75%",
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            boxWidth: 10,
            usePointStyle: true,
            color: getChartColors().text,
          },
        },
      },
    },
  });

  function updateChartsTheme() {
    const colors = getChartColors();
    barChart.options.scales.x.ticks.color = colors.text;
    barChart.options.scales.y.ticks.color = colors.text;
    barChart.options.scales.y.grid.color = colors.grid;
    barChart.update();
    donutChart.options.plugins.legend.labels.color = colors.text;
    donutChart.update();
  }

  const table = new Tabulator("#tProd", {
    data: activeProducts,
    layout: "fitColumns",
    responsiveLayout: "collapse",
    pagination: "local",
    paginationSize: 5,
    columns: [
      {
        title: "Produk",
        field: "name",
        headerFilter: "input",
        headerFilterPlaceholder: "Cari produk...",
        formatter: (cell) => `<b>${cell.getValue()}</b>`,
      },
      {
        title: "Kategori",
        field: "category",
        formatter: (cell) => {
          const val = cell.getValue();
          let colorClass =
            val === "Minuman" ? "green" : val === "Snack" ? "purple" : "blue";
          return `<span class="lozenge ${colorClass}">${val}</span>`;
        },
      },
      {
        title: "Terjual",
        field: "sold",
        horizAlign: "center",
        cssClass: "num",
      },
      {
        title: "Omzet",
        field: "price",
        horizAlign: "right",
        cssClass: "num",
        formatter: (cell) =>
          formatRp(cell.getValue() * cell.getRow().getData().sold),
      },
      {
        title: "",
        formatter: () =>
          `<button class="icon-btn del" type="button"><svg class="ic" viewBox="0 0 24 24"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>`,
        width: 40,
        cellClick: (e, cell) => {
          const rowData = cell.getRow().getData();
          Swal.fire({
            title: "Hapus Produk?",
            html: `Apakah Anda yakin ingin menghapus <b>${rowData.name}</b>?`,
            showCancelButton: true,
            confirmButtonText: "Hapus",
            cancelButtonText: "Batal",
          }).then((res) => {
            if (res.isConfirmed) {
              activeProducts = activeProducts.filter(
                (p) => p.id !== rowData.id,
              );
              cell.getRow().delete();
              updateDashboard();
            }
          });
        },
      },
    ],
  });

  const promoContainer = document.getElementById("promo");
  promoList.forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML = `<div class="p-emoji">${item.emoji}</div><div class="p-body"><b>${item.title}</b><small>${item.desc}</small></div><span class="lozenge ${item.color}">${item.tag}</span>`;
    promoContainer.appendChild(li);
  });
  document.getElementById("pCount").textContent = `${promoList.length} aktif`;

  function updateDashboard() {
    const filteredProducts = activeProducts.filter((p) =>
      selectedCategories.includes(p.category),
    );
    const totalOmzet = filteredProducts.reduce(
      (sum, p) => sum + p.price * p.sold,
      0,
    );
    const totalItems = filteredProducts.reduce((sum, p) => sum + p.sold, 0);

    document.getElementById("kOmzet").textContent = formatRp(totalOmzet);
    document.getElementById("cOmzet").textContent =
      `Rata-rata ${formatRp(Math.round(totalOmzet / 7))} per hari`;
    document.getElementById("kItem").textContent = totalItems;
    document.getElementById("cItem").textContent =
      `Dari ${filteredProducts.length} produk yang laku`;
    document.getElementById("kTrx").textContent = Math.round(totalItems / 12.4);

    const dates = fDate.selectedDates;
    if (dates.length === 2) {
      const d1 = dates[0].toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
      });
      const d2 = dates[1].toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
      });
      document.getElementById("dRange").textContent =
        `${d1} - ${d2} · ${selectedCategories.length} kategori · ${filteredProducts.length} produk`;
    }

    table.setData(filteredProducts);
    document.getElementById("tCount").textContent =
      `${filteredProducts.length} produk`;

    const catCounts = { Makanan: 0, Minuman: 0, Snack: 0 };
    filteredProducts.forEach((p) => {
      if (catCounts[p.category] !== undefined) catCounts[p.category] += p.sold;
    });
    donutChart.data.datasets[0].data = [
      catCounts["Makanan"],
      catCounts["Minuman"],
      catCounts["Snack"],
    ];
    donutChart.update();
  }

  updateDashboard();
});
