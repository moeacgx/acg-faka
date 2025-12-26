!function () {
    const $SwitchCategory = $(`.switch-category`), $ItemList = $(`.item-list`), categoryId = getVar("CAT_ID");


    function _PushCommodityList(data) {
        $ItemList.html("");

        if (data.length == 0) {
            layer.msg("没有商品");
            $ItemList.html(`<div style="margin-right: 10px;margin-top:10px;font-size: 1.1rem;">没有商品</div>`);
            return;
        }

        data.forEach(item => {
            const isSoldOut = item.stock == 0;
            $ItemList.append(`
            <div class="col-12 mb-2" data-id="${item.id}">
                <div class="product-item-row ${isSoldOut ? 'soldout' : ''}">
                    <div class="product-info">
                        <div class="product-name-row">
                            ${item.recommend == 1 ? `<span class="badge-soft badge-soft-primary me-1">推荐</span>` : ``}
                            <span class="product-name">${item.name}</span>
                        </div>
                        <div class="product-meta-row">
                             <span class="product-price">¥${item.price}</span>
                             <span class="product-stock ms-3">库存: ${item.stock}</span>
                        </div>
                    </div>
                    <div class="product-action">
                        <a href="${!isSoldOut ? `/item/${item.id}` : `javascript:void(0);`}" class="btn-buy ${isSoldOut ? 'disabled' : ''}">
                            ${isSoldOut ? '缺货' : '购买'}
                        </a>
                    </div>
                </div>
            </div>`);
        });
    }

    function _SwitchCategory(id, link = false) {
        $SwitchCategory.removeClass("active");
        $(`a[data-id=${id}]`).addClass("active");
        if (link) {
            history.pushState(null, '', `/cat/${id}`);
        }
        trade.getCommodityList({
            categoryId: id,
            done: data => {
                _PushCommodityList(data);
            }
        });
    }


    function _Search(keywords) {
        if (keywords == '') {
            layer.msg("请输入要搜索的商品名称关键词");
            return;
        }

        $SwitchCategory.removeClass("active");

        trade.getCommodityList({
            keywords: keywords,
            done: data => {
                _PushCommodityList(data);
            }
        });
    }


    //初次加载
    _SwitchCategory(categoryId > 0 ? categoryId : $SwitchCategory.first().data("id"));


    $SwitchCategory.click(function () {
        if ($(this).hasClass("active")) {
            return;
        }
        _SwitchCategory($(this).data("id"), true);
    });


    $('.item-search-input').on('keypress', function (e) {
        if (e.which === 13) { // 或者 e.key === "Enter"
            _Search($(this).val());
        }
    });
}();