var CommentBox = React.createClass({
    loadCommentsFromServer: function() {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            success: function(result) {
                this.setState({data: result.data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    getInitialState: function() {
        return {data: []};
    },
    componentDidMount: function() {
        this.loadCommentsFromServer();
        setInterval(this.loadCommentsFromServer, this.props.pollInterval);
    },
    handleCommentSubmit: function(comment) {
        //this.setState({data: this.state.data.concat([comment])});
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            type: 'POST',
            data: comment,
            success: function(data) {
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    render: function() {
        return (
            <div className="commentBox">
                <CommentList data={this.state.data} />
                <CommentForm onCommentSubmit={this.handleCommentSubmit} />
            </div>
        );
    }
});

var CommentList = React.createClass({
    render: function() {
        var commentNodes = this.props.data.map(function (comment) {
            return (
                <Comment author={comment.author} created_at={comment.created_at}>
                    {comment.text}
                </Comment>
            );
        });
        return (
            <table className="table table-bordered table-striped">
                <thead>
                    <tr>
                        <th>名前</th>
                        <th>コメント</th>
                        <th>投稿日時</th>
                    </tr>
                </thead>
                <tbody>
                    {commentNodes}
                </tbody>
            </table>
        );
    }
});

var CommentForm = React.createClass({
    handleSubmit: function(e) {
        e.preventDefault();
        var author = React.findDOMNode(this.refs.author).value.trim();
        var text = React.findDOMNode(this.refs.text).value.trim();
        if (!text || !author) {
            return;
        }
        this.props.onCommentSubmit({author: author, text: text});
        React.findDOMNode(this.refs.author).value = '';
        React.findDOMNode(this.refs.text).value = '';
        return;
    },
    render: function() {
        return (
            <form className="commentForm" onSubmit={this.handleSubmit}>
                <div className="form-group form-inline">
                    <input type="text" placeholder="山田 太郎" ref="author" className="form-control" />
                    <input type="text" placeholder="Ruby楽しい" ref="text" className="form-control" />
                    <input type="submit" value="投稿" className="btn btn-primary"/>
                </div>
            </form>
        );
    }
});

var Comment = React.createClass({
    render: function() {
        var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
        return (
            <tr>
                <td>{this.props.author}</td>
                <td><span dangerouslySetInnerHTML={{__html: rawMarkup}} /></td>
                <td>{this.props.created_at}</td>
            </tr>
        );
    }
});
