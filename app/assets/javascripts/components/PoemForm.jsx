import md from 'markdown-it'
import mdEmoji from 'markdown-it-emoji'
import mdCheckBox from 'markdown-it-checkbox'
const markdown_extension = { linkify: true, breaks: true }
const markdown = md(markdown_extension).use(mdEmoji).use(mdCheckBox)

export default class PoemForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {description: props.description, title: props.title};
  }

  componentDidMount(){
    require('jquery-textcomplete')
    $(this.refs.textarea).textcomplete([
      { // emoji strategy
        match: /\B:([\-+\w]*)$/,
        search(term, callback) {
          return $.getJSON("/api/emoji", {
            query: term
          }).done(function(data) {
            return callback(data)
          }).fail(function() {
            return callback([])
          })
        },
        template(data) {
          return `<img src="${data.url}" class="emoji"></img> ${data.value}`;
        },
        replace(data) {
          return `:${data.value}:`;
        },
        index: 1
      }
    ], {
      onKeydown(e, commands) {
        if (e.ctrlKey && e.keyCode === 74) { // CTRL-J
          return commands.KEY_ENTER;
        }
      }
    })
  }

  onChange(event) {
    let attr = {}
    attr[event.target.id] = event.target.value
    this.setState(attr)
  }

  rawMarkup() {
    return { __html: markdown.render(this.state.description) };
  }

  render () {
    return (
      <div className="row">
        <div className="col-sm-6 panel panel-default poem-form">
          <div className="panel-body">
            <div className="form-group string required poem_title">
              <label className="string required control-label" htmlFor="poem_title">
                <abbr title="required">*</abbr> タイトル</label>
              <input className="string required form-control" onChange={this.onChange.bind(this)}
                id="title" type="text" name="poem[title]" value={this.state.title}/>
            </div>
            <div className="form-group text required poem_description">
              <label className="text required control-label" htmlFor="poem_description">
                <abbr title="required">*</abbr> 本文</label>
              <textarea className="text required form-control"
                rows="10" onChange={this.onChange.bind(this)}
                id="description" name="poem[description]"
                value={this.state.description} ref="textarea"></textarea>
            </div>
          </div>
        </div>
        <div className="col-sm-6 panel panel-default poem-preview">
          <div className="panel-body">
            <div className="page-header">
              <h3>{this.state.title}</h3>
            </div>
            <div className="poem-area" dangerouslySetInnerHTML={this.rawMarkup()} />
          </div>
        </div>
      </div>
    );
  }
}

PoemForm.propTypes = {
  title: React.PropTypes.string,
  description: React.PropTypes.string
};
