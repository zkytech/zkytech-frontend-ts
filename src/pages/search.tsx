import React from 'react';
import ArticleList from '../components/article_list'
import QueueAnim from "rc-queue-anim";
import {RouteComponentProps, withRouter} from "react-router";

interface SearchPageProps extends RouteComponentProps<any>{

}

interface SearchPageState {
    keyword:string
}


class SearchPage extends React.Component<SearchPageProps,SearchPageState> {

    public state:SearchPageState = {
        keyword: this.props.match.params.keyword
    }


    componentWillReceiveProps(nextProps:Readonly<SearchPageProps>, nextContext:any) {
        this.setState(
            {keyword: nextProps.match.params.keyword}
        )
    }

    render() {
        return (<QueueAnim
                type={['right', 'left']}
                duration={700}
            >
                <ArticleList keyword={this.state.keyword} key={'1'}/>
            </QueueAnim>
        );
    }
}
export default withRouter(SearchPage)