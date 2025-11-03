import PropTypes from 'prop-types';
import './theme.css';
import { FeedbackMessageProvider } from './FeedbackMessageContext';
import FeedbackMessageDisplay from './FeedbackMessageDisplay';
import MainHeader from './MainHeader';
import MainFooter from './MainFooter';

function MainStructure({ children, isPublic = false }) {

    return (
        <FeedbackMessageProvider>
            {!isPublic &&
            <div id="mainHeader">
                <MainHeader />
            </div>
            }

            <div id="mainBody">
                <div id='mainBodySection'>
                    {children}
                </div>
            </div>

            <div id="mainFooter">
                <MainFooter />
            </div>

            <FeedbackMessageDisplay />
        </FeedbackMessageProvider>
    );
}
MainStructure.propTypes = {
    children: PropTypes.node.isRequired,
};
export default MainStructure;