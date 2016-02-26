import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import HelmetTitle from '../app/HelmetTitle';
import claimActions from './claimActions';
import Loading from '../app/Loading';
import InvalidPullRequest from './InvalidPullRequest';
import LoadingPullRequest from './LoadingPullRequest';
import Dropzone from 'react-dropzone';

const styles = {
    dropzone: {
        display: 'inline-block',
        borderWidth: '2px',
        borderColor: 'black',
        borderStyle: 'dashed',
        borderRadius: '4px',
        margin: '0',
        padding: '1em',
        width: '20em',
        height: '20em',
        transition: 'all 0.5s',
    },
    image: {
        verticalAlign: 'top',
        maxWidth: '18em',
        maxHeight: '18em',
    },
    buttonBar: {
        marginTop: '1em',
    },
    feedback: {
        marginLeft: '1em',
    },
};

class Claim extends Component {
    constructor(props) {
        super(props);

        this.state = {
            image: undefined,
        };
    }

    componentDidMount() {
        this.props.loadPullRequest(this.props.repository, this.props.pullRequestNumber);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.repository !== nextProps.repository || this.props.pullRequestNumber !== nextProps.pullRequestNumber) {
            this.props.loadPullRequest(this.props.repository, this.props.pullRequestNumber);
        }
    }

    onDrop(files) {
        this.setState({image: files[0]});
    }

    onSubmit() {
        const { pullRequestNumber, repository } = this.props;

        this.props.claim(
            repository,
            pullRequestNumber,
            this.state.image
        );
    }

    render() {
        const { claimError, claiming, error, loading, pullRequest, pullRequestNumber, repository, timeBeforeDisplay } = this.props;

        return (
            <div className="container claim-page">
                <HelmetTitle title="Claim your pull request" />
                {(error || !repository || !pullRequestNumber) && <InvalidPullRequest />}

                {loading && repository && pullRequestNumber && <LoadingPullRequest {...{ pullRequestNumber, repository }} />}

                {!loading && pullRequest &&
                    <div className="row">
                        <div className="col-xs-12">
                            <h2>Hi {pullRequest.user.login}!</h2>
                            <p>You submited this pull request (<a href={pullRequest.html_url} target="_blank">{pullRequest.title}</a>) on {moment(pullRequest.created_at).format('LL')}.</p>
                            <p>Please send us an image you'd like to see on the <b>ZeroDollarHomePage</b> !</p>
                            <hr />
                            <div className="row">
                                <div className="col-xs-12">
                                    <Dropzone onDrop={this.onDrop.bind(this)} style={styles.dropzone}>
                                        {!this.state.image && <div>Drop an image here, or click to select the file to upload.</div>}
                                        {this.state.image && <img className="img-thubnail" style={styles.image} src={this.state.image.preview} />}
                                    </Dropzone>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-xs-12">
                                    <p style={styles.buttonBar}>
                                        <button onClick={this.onSubmit.bind(this)} className="btn btn-primary btn-lg" disabled={!this.state.image || claiming}>
                                            {claiming && <Loading />} Submit !
                                        </button>
                                        {claimError && <span className="text-danger" style={styles.feedback}>An error occured while claiming your pull request</span>}
                                        {timeBeforeDisplay && <span className="text-success" style={styles.feedback}>Thanks ! You image should be displayed {timeBeforeDisplay.fromNow()} ({timeBeforeDisplay.format('LL')})</span>}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        );
    }
}

Claim.propTypes = {
    claim: PropTypes.func.isRequired,
    claiming: PropTypes.bool.isRequired,
    claimError: PropTypes.object,
    error: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    loadPullRequest: PropTypes.func.isRequired,
    pullRequest: PropTypes.object,
    pullRequestNumber: PropTypes.string,
    repository: PropTypes.string,
    timeBeforeDisplay: PropTypes.object,
};

function mapStateToProps(state) {
    return {
        claimError: state.claim.claimError,
        claiming: state.claim.claiming,
        error: state.claim.error,
        loading: state.claim.loading,
        pullRequest: state.claim.item,
        pullRequestNumber: state.routing.location.query && state.routing.location.query.pr,
        repository: state.routing.location.query && state.routing.location.query.repository,
        timeBeforeDisplay: state.claim.timeBeforeDisplay,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        claim: claimActions.claim.request,
        loadPullRequest: claimActions.item.request,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Claim);