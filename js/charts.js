function drawDiagramCharts(options) {
    Highcharts.chart(options["div_id"], {
        title: {
            style: {"color": "#6C757E", "fontSize": "14px"},
            text: options["title"],
            align: 'center'
        },
        xAxis: {
            lineColor: "#F0EFEF",
            gridLineWidth: 0,
            gridLineColor: "#F0EFEF",
            categories: options["x"],
            title: {
                text: ""
            }            
        },
        yAxis: {
            lineColor: "#F0EFEF",
            gridLineWidth: 1,
            gridLineColor: "#F0EFEF",
            title: {
                text: ''
            }
        },
        plotOptions: {
          column: {
            // stacking: 'normal',
            grouping: false,
            dataLabels: {
              enabled: true
            }
          }
        },
        chart: {
            backgroundColor: "#E3E3E3",
            borderRadius: 10,
            width: options["width"],
            height: options["height"],
        },
        
        series: [{
            type: 'column',
            name: 'Факт',
            color: "#362E2F",
            dataLabels: {
                inside: true,
                style: {
                    color: "#212529E5",
                }
            },
            data: options["fact"],
            zIndex: 2,
            pointPadding: 0.25,
        }, {
            type: 'column',
            name: 'План',
            color: "#6C757E",
            dataLabels: {
                inside: false,
                style: {
                    color: "#212529E5"
                }
            },
            data: options["plan"],
        }, {
            type: 'spline',
            name: 'Тренд',
            data: options["trend"],
            marker: {
                lineWidth: 1,
                lineColor: "#083FCC",
                fillColor: 'white'
            }
        }]
    })
}

function drawPeriodByContractorsChart(options) {
    Highcharts.chart(options["div_id"], {
        title: {
            style: {"color": "#6C757E", "fontSize": "14px"},
            text: options["title"],
            align: 'center'
        },
        xAxis: {
            lineColor: "#F0EFEF",
            gridLineWidth: 0,
            gridLineColor: "#F0EFEF",
            categories: options["x"],
            title: {
                text: ""
            }            
        },
        yAxis: {
            lineColor: "#F0EFEF",
            gridLineWidth: 1,
            gridLineColor: "#F0EFEF",
            title: {
                text: ''
            }
        },
        plotOptions: {
            column: {
                cursor: 'pointer',
                // stacking: 'normal',
                grouping: false,
                dataLabels: {
                    enabled: true,
            },
            point: {
                events: {
                    click: function () {
                        singleTotalIncomeByYears(this.contractor_id, this.category)
                    }
                }
            }
        },
        },
        chart: {
            backgroundColor: "#E3E3E3",
            borderRadius: 10,
            width: options["width"],
            height: options["height"],
        },
        tooltip: {
            useHTML: true,
            formatter: function () {
                let is_increased = this.point.options.is_increased
                let percent = this.point.options.percent
                let img = ''
                if (typeof(is_increased) != 'undefined') {
                    img = is_increased ? `<img src="./img/go_up.svg" alt="">${percent}%` : `<img src="./img/go_dawn.svg" alt="">${percent}%`
                }
                return `${this.x}:<br><p style="display: flex; gap: 2px;">${this.y}₽${img}</p>`;
            },
        },
        series: [{
            type: 'column',
            name: 'Факт',
            // color: "black",
            dataLabels: {
                inside: true,
                style: {
                    color: "#212529E5"
                },
                format: `{series.name}:<br>{point.y} ₽`,
            },
            color: "black",
            data: options["fact"],
            zIndex: 2,
            pointPadding: 0.25,
        }, {
            type: 'column',
            name: 'План',
            color: "white",
            dataLabels: {
                inside: false,
                style: {
                    color: "#212529E5"
                },
                format: `{series.name}:<br>{point.y} ₽`
            },
            data: options["plan"],
        }]
    })
}

function singleTotalIncomeByYears(contractor_id, contractor_name_) {
    addLoading()
    queryAPI_GET(`report/total_income/${contractor_id}?${window.filter2 || ""}`).then(res => {
        if (res.ok) {
            res.json().then(json => {
                by_years_div.innerHTML = totalIncomeByYears(json["year_by_contractors"], json["max_values"]["year_by_contractors"])
                if (!contractor_name.parentElement.querySelector(".button")) {
                    let reset_btn = document.createElement("div")
                    reset_btn.classList.add("button")
                    reset_btn.innerHTML = 'Сбросить'
                    contractor_name.parentElement.appendChild(reset_btn)
                    reset_btn.addEventListener("click", () => {
                        total_income.click()
                    })
                }
                contractor_name.innerHTML = `(${contractor_name_})`
            })
        } else {
            // Сообщение об ошибке
            console.log(res.status);
            res.json().then(json => {
                errorWin(json["message"]);
            })
        }
    }).catch().finally(() => {removeLoading()})
}

function totalIncomeByYears(by_years, max_value){
    let rows = ``
    by_years.forEach(item => {
        rows += `
        <div class="flex h-6 text-xs justify-start items-center mt-3" style="width: ${widthPercent(max_value, item["value"])}%; min-width: 170px;">
            <p class="min-w-[60px]">${item["year"]} год</p>
            <div class="flex h-full justify-end pr-2 items-center text-[#FFFFFF] w-[84%] bg-[#394858]">${toLocalString(item["value"])}</div>
        </div>
        `
    })
    return rows
}

function drawDiagramChartsTwo(options) {
    Highcharts.chart(options["div_id"], {
        title: {
            style: {"color": "#6C757E", "fontSize": "14px"},
            text: options["title"],
            align: 'center'
        },
        xAxis: {
            lineColor: "#F0EFEF",
            gridLineWidth: 0,
            gridLineColor: "#F0EFEF",
            categories: options["x"],
            title: {
                text: ""
            }            
        },
        yAxis: {
            lineColor: "#F0EFEF",
            gridLineWidth: 1,
            gridLineColor: "#F0EFEF",
            title: {
                text: ''
            }
        },
        plotOptions: {
          column: {
            stacking: 'normal',
            dataLabels: {
              enabled: true
            }
          }
        },
        chart: {
            backgroundColor: "#E5E5E5",
            borderRadius: 10,
            width: options["width"],
            height: options["height"],
        },
        
        series: [{
            type: 'column',
            name: 'Текущий месяц',
            color: "#362E2F",
            dataLabels: {
                inside: false,
                style: {
                    color: "#212529E5"
                }
            },
            data: options["data_curr"]
        }, {
            type: 'column',
            name: 'План',
            color: "#6C757E",
            dataLabels: {
                inside: false,
                style: {
                    color: "#212529E5"
                }
            },
            data: options["data_next"]
        }, {
            type: 'spline',
            name: 'Тренд',
            data: options["trend"],
            marker: {
                lineWidth: 1,
                lineColor: "#083FCC",
                fillColor: 'white'
            }
        }]
    })
}

function drawPieCharts(options) {
    Highcharts.chart(options["div_id"], {
        chart: {
            backgroundColor: "#E5E5E5",
            type: 'pie',
        },
        title: {
            text: ''
        },
        tooltip: {
            pointFormat: `{series.name}: <b>{point.y:.2f} ₽</b>`
        },
        accessibility: {
            point: {
                valueSuffix: '%'
            }
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '{point.name}<br><p style="font-weight: 200;">Значение: {point.y:.2f} ₽<br>{point.percentage:.1f}%</p>',
                    events: {
                        click: function () {
                            if (document.querySelector("#period_by_contractors_chart")) {
                                
                            } else {
                                if (!this.selected) {
                                    showLinkedContractors(this.linked_ids)
                                } else {
                                    showAllContractors()
                                }
                            }
                        }
                    }
                },
                point: {
                    events: {
                        click: function () {
                            if (document.querySelector("#period_by_contractors_chart")) {
                                singleTotalIncomeByYears(this.contractor_id, this.name)
                            } else {
                                if (!this.selected) {
                                    showLinkedContractors(this.linked_ids)
                                } else {
                                    showAllContractors()
                                }
                            }
                        }
                    }
                }
            }
        },
        series: [{
            name: 'Значение',
            colorByPoint: true,
            data: options["data"]
        }]
    });
}

function showLinkedContractors(ids) {
    analitics_content.querySelectorAll(".main_row[contractors_id]").forEach(item => {
        if (ids.includes(+item.getAttribute("contractors_id"))) {
            item.parentElement .style.display = null
        } else {
            item.parentElement.style.display = "none"
        }
    })
}

function showAllContractors() {
    analitics_content.querySelectorAll(".main_row[contractors_id]").forEach(item => {
        item.parentElement .style.display = null
    })
}
