var profile = {
    resourceTags: {
        ignore: function (filename, mid) {
            return mid != "moment/moment";
        },
        amd: function(filename, mid){
            return /\.js$/.test(filename);
        }
    }
};
